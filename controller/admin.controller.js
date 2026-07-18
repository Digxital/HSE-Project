const bcrypt = require("bcryptjs");
const User = require("../model/user.model");
const {
    logUserCreation,
    logUserUpdate,
    logRoleChange,
    logRecordDeletion
} = require("../utils/auditLog");
const {
    findUserInTenant,
    buildTenantDocumentFilter,
    buildCertificationScopeFilter,
    clientBelongsToTenant
} = require("../utils/tenantScope");
const { buildProfilePicPayload, deleteFile } = require("../utils/fileHandler");
const { formatUserWithLocation, formatUsersWithLocation } = require("../utils/userLocation");
const { ensureTenantOrganization } = require("../utils/ensureTenantOrganization");

const ASSIGNABLE_USER_ROLES = ["SUPERVISOR", "FIELD_USER", "HSE_OFFICER"];

const roleRequiresClientLocation = (role) => {
    const normalizedRole = role ? String(role).toUpperCase() : null;
    return Boolean(normalizedRole && ASSIGNABLE_USER_ROLES.includes(normalizedRole));
};

const normalizeAssignableRole = (role) => {
    if (role === undefined || role === null || String(role).trim() === "") {
        return null;
    }
    return String(role).toUpperCase().trim();
};

const resolveUserLocation = async (tenantId, role, location, { existingLocation } = {}) => {
    const normalizedRole = role ? String(role).toUpperCase() : null;
    const explicitLocation =
        location !== undefined && String(location).trim() !== ""
            ? String(location).trim()
            : null;

    if (explicitLocation) {
        const isValidClient = await clientBelongsToTenant(explicitLocation, tenantId);
        if (!isValidClient) {
            return { error: "Invalid client for your organization" };
        }
        return { value: explicitLocation };
    }

    if (!roleRequiresClientLocation(normalizedRole)) {
        return {};
    }

    if (existingLocation && String(existingLocation).trim() !== "") {
        return { value: String(existingLocation).trim() };
    }

    const organization = await ensureTenantOrganization(tenantId);

    if (!organization) {
        return { error: "Organization not found" };
    }

    if (!organization.clientId) {
        return { error: "Organization client not configured" };
    }

    return { value: organization.clientId.toString() };
};

// ADMIN can create supervisor, field user, HSE officer, or a pending user without a role

exports.createUser = async (req, res) => {
    try {
        const { firstName, lastName, email, password, role, location, phoneNumber } = req.body;

        const exists = await User.findOne({ email });
        if (exists) {
            return res.status(400).json({
                success: false,
                message: "User already exists",
                data: {}
            });
        }

        const normalizedRole = normalizeAssignableRole(role);
        if (role !== undefined && role !== null && String(role).trim() !== "") {
            if (!ASSIGNABLE_USER_ROLES.includes(normalizedRole)) {
                return res.status(400).json({
                    success: false,
                    message: "Role must be SUPERVISOR, FIELD_USER, or HSE_OFFICER",
                    data: {}
                });
            }
        }

        const passwordHash = await bcrypt.hash(password, 10);
        const resolvedLocation = await resolveUserLocation(
            req.user.tenantId,
            normalizedRole,
            location
        );

        if (resolvedLocation.error) {
            return res.status(400).json({
                success: false,
                message: resolvedLocation.error,
                data: {}
            });
        }

        const userData = {
            tenantId: req.user.tenantId,
            firstName,
            lastName,
            email,
            passwordHash,
            role: normalizedRole,
            status: "PENDING"
        };

        if (resolvedLocation.value !== undefined) {
            userData.location = resolvedLocation.value;
        }

        if (phoneNumber !== undefined && phoneNumber !== null) {
            userData.phoneNumber = String(phoneNumber).trim();
        }

        const newUser = await User.create(userData);

        let adminEmail = req.user.email;
        if (!adminEmail) {
            const adminUser = await User.findById(req.user.id);
            adminEmail = adminUser?.email || "system@admin.com";
        }

        await logUserCreation({
            tenantId: req.user.tenantId,
            createdBy: req.user.id,
            createdByEmail: adminEmail,
            userId: newUser._id,
            userEmail: email,
            userData,
            req
        });

        const formattedUser = await formatUserWithLocation(newUser);

        return res.status(201).json({
            success: true,
            message: normalizedRole
                ? `${normalizedRole} created successfully`
                : "User created successfully",
            data: {
                id: newUser._id,
                user: formattedUser
            }
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: "Failed to create user",
            data: {}
        });
    }
};

exports.getUsers = async (req, res) => {
    try {
        const users = await User.find(buildTenantDocumentFilter(req.user.tenantId))
            .select("-passwordHash");

        const formattedUsers = await formatUsersWithLocation(users);

        return res.json({
            success: true,
            message: "Users fetched successfully",
            data: formattedUsers
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to fetch users",
            data: {}
        });
    }
};

exports.getUserById = async (req, res) => {
    try {
        const user = await findUserInTenant(req.params.id, req.user.tenantId);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
                data: {}
            });
        }

        const [formattedUser] = await formatUsersWithLocation([user]);

        return res.json({
            success: true,
            message: "User fetched successfully",
            data: formattedUser
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: "Invalid ID",
            data: {}
        });
    }
};

exports.updateUser = async (req, res) => {
    try {
        let { firstName, lastName, role, status, location, phoneNumber } = req.body;

        if (role) {
            role = role.toUpperCase();
            if (!ASSIGNABLE_USER_ROLES.includes(role)) {
                if (req.file?.path) {
                    deleteFile(req.file.path);
                }
                return res.status(400).json({
                    success: false,
                    message: "Role must be SUPERVISOR, FIELD_USER, or HSE_OFFICER",
                    data: {}
                });
            }
        }
        if (status) status = status.toUpperCase();

        const currentUser = await findUserInTenant(req.params.id, req.user.tenantId);

        if (!currentUser) {
            return res.status(404).json({
                success: false,
                message: "User not found",
                data: {}
            });
        }

        // If activating user, validate that role is assigned
        if (status === "ACTIVE") {
            const roleToCheck = role || currentUser.role;

            if (!roleToCheck || !ASSIGNABLE_USER_ROLES.includes(roleToCheck)) {
                return res.status(400).json({
                    success: false,
                    message: "Role must be assigned before activation.",
                    data: {}
                });
            }
        }

        const updateData = {};
        if (firstName !== undefined) updateData.firstName = firstName;
        if (lastName !== undefined) updateData.lastName = lastName;
        if (role !== undefined) updateData.role = role;
        if (status !== undefined) updateData.status = status;

        if (phoneNumber !== undefined) updateData.phoneNumber = String(phoneNumber).trim();

        const effectiveRole = role !== undefined ? role : currentUser.role;
        const resolvedLocation = await resolveUserLocation(
            req.user.tenantId,
            effectiveRole,
            location,
            { existingLocation: currentUser.location }
        );

        if (resolvedLocation.error) {
            if (req.file?.path) {
                deleteFile(req.file.path);
            }
            return res.status(400).json({
                success: false,
                message: resolvedLocation.error,
                data: {}
            });
        }

        if (location !== undefined) {
            updateData.location = resolvedLocation.value ?? "";
        } else if (
            roleRequiresClientLocation(effectiveRole)
            && resolvedLocation.value
            && !currentUser.location
        ) {
            updateData.location = resolvedLocation.value;
        }

        const profilePic = buildProfilePicPayload(req.file);
        if (profilePic) updateData.profilePic = profilePic;

        if (Object.keys(updateData).length === 0) {
            if (req.file?.path) {
                deleteFile(req.file.path);
            }
            return res.status(400).json({
                success: false,
                message: "At least one field or profilePic is required",
                data: {}
            });
        }

        const user = await User.findOneAndUpdate(
            { _id: req.params.id, tenantId: req.user.tenantId },
            updateData,
            { new: true, runValidators: true }
        ).select("-passwordHash");

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
                data: {}
            });
        }

        // Get admin email from token or from database
        let adminEmail = req.user.email;
        if (!adminEmail) {
            const adminUser = await User.findById(req.user.id);
            adminEmail = adminUser?.email || "system@admin.com";
        }

        // Log role change if role was updated
        if (role && role !== currentUser.role) {
            await logRoleChange({
                tenantId: req.user.tenantId,
                changedBy: req.user.id,
                changedByEmail: adminEmail,
                userId: user._id,
                userEmail: user.email,
                oldRole: currentUser.role,
                newRole: role,
                req
            });
        }

        // Log user update
        await logUserUpdate({
            tenantId: req.user.tenantId,
            updatedBy: req.user.id,
            updatedByEmail: adminEmail,
            userId: user._id,
            userEmail: user.email,
            before: {
                firstName: currentUser.firstName,
                lastName: currentUser.lastName,
                role: currentUser.role,
                status: currentUser.status,
                location: currentUser.location,
                phoneNumber: currentUser.phoneNumber,
                profilePic: currentUser.profilePic
            },
            after: {
                firstName: user.firstName,
                lastName: user.lastName,
                role: user.role,
                status: user.status,
                location: user.location,
                phoneNumber: user.phoneNumber,
                profilePic: user.profilePic
            },
            req
        });

        const formattedUser = await formatUserWithLocation(user);

        return res.json({
            success: true,
            message: "User updated successfully",
            data: formattedUser
        });
    } catch (error) {
        if (req.file?.path) {
            deleteFile(req.file.path);
        }
        return res.status(400).json({
            success: false,
            message: "Failed to update user",
            data: {}
        });
    }
};

exports.deleteUser = async (req, res) => {
    try {
        const user = await User.findOneAndDelete({
            _id: req.params.id,
            tenantId: req.user.tenantId
        });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
                data: {}
            });
        }

        // Get admin email from token or from database
        let adminEmail = req.user.email;
        if (!adminEmail) {
            const adminUser = await User.findById(req.user.id);
            adminEmail = adminUser?.email || "system@admin.com";
        }

        // Log user deletion
        await logRecordDeletion({
            tenantId: req.user.tenantId,
            deletedBy: req.user.id,
            deletedByEmail: adminEmail,
            recordId: user._id,
            recordType: "USER",
            recordName: user.email,
            recordData: {
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                role: user.role,
                status: user.status
            },
            req
        });

        return res.json({
            success: true,
            message: "User deleted successfully",
            data: {}
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: "Invalid ID",
            data: {}
        });
    }
};

exports.deactivateUser = async (req, res) => {
    try {
        const user = await findUserInTenant(req.params.id, req.user.tenantId);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
                data: {}
            });
        }

        user.status = "DEACTIVATED";
        await user.save();

        return res.json({
            success: true,
            message: "User deactivated successfully",
            data: {}
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: "Invalid ID",
            data: {}
        });
    }
};

exports.activateUser = async (req, res) => {
    try {
        let { role } = req.body;

        // Normalize to uppercase
        if (role) role = role.toUpperCase();

        // Validate role assignment
        if (!role || !ASSIGNABLE_USER_ROLES.includes(role)) {
            return res.status(400).json({
                success: false,
                message: "Role must be assigned before activation.",
                data: {}
            });
        }

        const user = await findUserInTenant(req.params.id, req.user.tenantId);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
                data: {}
            });
        }

        const resolvedLocation = await resolveUserLocation(
            req.user.tenantId,
            role,
            undefined,
            { existingLocation: user.location }
        );

        if (resolvedLocation.error) {
            return res.status(400).json({
                success: false,
                message: resolvedLocation.error,
                data: {}
            });
        }

        user.role = role;
        user.status = "ACTIVE";

        if (roleRequiresClientLocation(role) && resolvedLocation.value && !user.location) {
            user.location = resolvedLocation.value;
        }

        await user.save();

        const formattedUser = await formatUserWithLocation(user);

        return res.json({
            success: true,
            message: "User activated successfully",
            data: { user: formattedUser }
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: "Invalid ID",
            data: {}
        });
    }
};

// GET /api/admin/certifications
// Returns all certifications from all users for admin overview
exports.getAllCertifications = async (req, res) => {
    try {
        const Certification = require("../model/certification.model");
        const certificationFilter = await buildCertificationScopeFilter(req.user.tenantId);

        const certifications = await Certification.find(certificationFilter)
            .populate("userId", "firstName lastName email role")
            .populate("createdBy", "firstName lastName")
            .sort({ createdAt: -1 });

        // Format response to rename _id to certificationId
        const formattedCertifications = certifications.map(cert => ({
            certificationId: cert._id.toString(),
            referenceId: cert.externalId,
            userId: cert.userId,
            certificationName: cert.certificationName,
            issuingAuthority: cert.issuingAuthority,
            issueDate: cert.issueDate.toISOString().split('T')[0],
            expiryDate: cert.expiryDate.toISOString().split('T')[0],
            fileUrl: cert.fileUrl,
            status: cert.status,
            createdBy: cert.createdBy,
            createdAt: cert.createdAt.toISOString()
        }));

        return res.json({
            success: true,
            message: "All certifications fetched successfully",
            data: formattedCertifications
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to fetch certifications",
            data: {}
        });
    }
};