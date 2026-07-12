const bcrypt = require("bcryptjs");
const Organization = require("../model/organization.model");
const User = require("../model/user.model");
const Client = require("../model/client.model");
const Location = require("../model/location.model");
const Notification = require("../model/notification.model");
const { generateNextOrganizationId } = require("../utils/organizationId");
const { extractFileMetadata, deleteFile } = require("../utils/fileHandler");
const { ensureTenantOrganization } = require("../utils/ensureTenantOrganization");

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MIN_PASSWORD_LENGTH = 6;

const ORGANIZATION_STATUSES = ["PENDING", "ACTIVE", "INACTIVE"];

const splitContactName = (fullName) => {
    const trimmed = String(fullName).trim();
    const spaceIndex = trimmed.indexOf(" ");

    if (spaceIndex === -1) {
        return { firstName: trimmed, lastName: trimmed };
    }

    return {
        firstName: trimmed.slice(0, spaceIndex).trim(),
        lastName: trimmed.slice(spaceIndex + 1).trim() || trimmed
    };
};

const mapOrganizationStatusToUserStatus = (organizationStatus) => {
    if (organizationStatus === "ACTIVE") {
        return "ACTIVE";
    }

    if (organizationStatus === "INACTIVE") {
        return "DEACTIVATED";
    }

    return "PENDING";
};

const syncOrganizationAdminStatus = async (organization, organizationStatus) => {
    if (!organization?.adminUserId) {
        return;
    }

    await User.findByIdAndUpdate(organization.adminUserId, {
        status: mapOrganizationStatusToUserStatus(organizationStatus)
    });
};

const rollbackOrganizationCreation = async ({ organization, adminUser, client }) => {
    if (adminUser?._id) {
        await Notification.deleteMany({ user: adminUser._id });
        await User.findByIdAndDelete(adminUser._id);
    }

    if (client?._id) {
        await Location.deleteMany({ clientId: client._id });
        await Client.findByIdAndDelete(client._id);
    }

    if (organization?._id) {
        await Organization.findByIdAndDelete(organization._id);
    }
};

const validateOrganizationInput = (body, { requireAll = true } = {}) => {
    const {
        organizationName,
        primaryContactPersonName,
        contactEmail,
        contactPhoneNumber,
        organizationAddress,
        password
    } = body;

    const errors = [];

    if (requireAll || organizationName !== undefined) {
        if (!organizationName || !String(organizationName).trim()) {
            errors.push("organizationName is required");
        }
    }

    if (requireAll || primaryContactPersonName !== undefined) {
        if (!primaryContactPersonName || !String(primaryContactPersonName).trim()) {
            errors.push("primaryContactPersonName is required");
        }
    }

    if (requireAll || contactEmail !== undefined) {
        if (!contactEmail || !String(contactEmail).trim()) {
            errors.push("contactEmail is required");
        } else if (!EMAIL_PATTERN.test(String(contactEmail).trim())) {
            errors.push("contactEmail must be a valid email address");
        }
    }

    if (requireAll || contactPhoneNumber !== undefined) {
        if (!contactPhoneNumber || !String(contactPhoneNumber).trim()) {
            errors.push("contactPhoneNumber is required");
        }
    }

    if (requireAll || organizationAddress !== undefined) {
        if (!organizationAddress || !String(organizationAddress).trim()) {
            errors.push("organizationAddress is required");
        }
    }

    if (requireAll || password !== undefined) {
        if (!password || !String(password).trim()) {
            errors.push("password is required");
        } else if (String(password).trim().length < MIN_PASSWORD_LENGTH) {
            errors.push(`password must be at least ${MIN_PASSWORD_LENGTH} characters`);
        }
    }

    return errors;
};

const buildOrganizationUpdateData = (body) => {
    const updateData = {};
    const allowedFields = [
        "organizationName",
        "primaryContactPersonName",
        "contactEmail",
        "contactPhoneNumber",
        "organizationAddress"
    ];

    allowedFields.forEach(field => {
        if (body[field] !== undefined) {
            if (field === "contactEmail") {
                updateData[field] = String(body[field]).trim().toLowerCase();
            } else {
                updateData[field] = String(body[field]).trim();
            }
        }
    });

    return updateData;
};

const buildLogoPayload = (file) => {
    if (!file) {
        return undefined;
    }

    const metadata = extractFileMetadata(file);

    return {
        url: metadata.url,
        filename: metadata.filename,
        originalName: metadata.originalName,
        mimetype: metadata.mimetype,
        size: metadata.size,
        uploadedAt: metadata.uploadedAt
    };
};

const cleanupUploadedLogo = (file) => {
    if (file && file.path) {
        deleteFile(file.path);
    }
};

const createOrganizationWithRetry = async (payload, maxAttempts = 3) => {
    let lastError;

    for (let attempt = 0; attempt < maxAttempts; attempt++) {
        try {
            const organizationId = await generateNextOrganizationId();

            return await Organization.create({
                ...payload,
                organizationId
            });
        } catch (error) {
            lastError = error;

            if (error.code !== 11000 || attempt === maxAttempts - 1) {
                throw error;
            }
        }
    }

    throw lastError;
};

exports.createOrganization = async (req, res) => {
    let organization;
    let adminUser;
    let client;

    try {
        const validationErrors = validateOrganizationInput(req.body);

        if (validationErrors.length > 0) {
            cleanupUploadedLogo(req.file);
            return res.status(400).json({
                success: false,
                message: validationErrors.join(", "),
                data: {}
            });
        }

        const {
            organizationName,
            primaryContactPersonName,
            contactEmail,
            contactPhoneNumber,
            organizationAddress,
            password
        } = req.body;

        const normalizedEmail = String(contactEmail).trim().toLowerCase();

        const existingUser = await User.findOne({ email: normalizedEmail });

        if (existingUser) {
            cleanupUploadedLogo(req.file);
            return res.status(400).json({
                success: false,
                message: "An account already exists with this contact email",
                data: {}
            });
        }

        const logo = buildLogoPayload(req.file);
        const { firstName, lastName } = splitContactName(primaryContactPersonName);
        const passwordHash = await bcrypt.hash(String(password).trim(), 10);

        const organizationPayload = {
            organizationName: String(organizationName).trim(),
            primaryContactPersonName: String(primaryContactPersonName).trim(),
            contactEmail: normalizedEmail,
            contactPhoneNumber: String(contactPhoneNumber).trim(),
            organizationAddress: String(organizationAddress).trim(),
            status: "PENDING"
        };

        if (logo) {
            organizationPayload.logo = logo;
        }

        organization = await createOrganizationWithRetry(organizationPayload);

        try {
            client = await Client.create({
                tenantId: organization._id,
                name: String(organizationName).trim(),
                description: String(organizationAddress).trim()
            });

            organization.clientId = client._id;
            await organization.save();

            adminUser = await User.create({
                tenantId: organization._id,
                firstName,
                lastName,
                email: normalizedEmail,
                passwordHash,
                role: "ADMIN",
                status: "PENDING"
            });

            organization.adminUserId = adminUser._id;
            await organization.save();

            await Notification.create({
                user: adminUser._id,
                type: "organization_created",
                title: "Organization created",
                description: `Your organization "${String(organizationName).trim()}" has been created.`,
                data: {
                    organizationId: organization.organizationId,
                    organizationMongoId: organization._id.toString(),
                    organizationName: String(organizationName).trim()
                }
            });
        } catch (innerError) {
            await rollbackOrganizationCreation({ organization, adminUser, client });
            throw innerError;
        }

        return res.status(201).json({
            success: true,
            message: "Organization created successfully",
            data: organization
        });
    } catch (error) {
        console.error("=== Error creating organization ===");
        console.error("Name:", error.name);
        console.error("Message:", error.message);
        console.error("Stack:", error.stack);
        if (error.errors) console.error("Validation errors:", error.errors);
        if (error.keyValue) console.error("Duplicate key value:", error.keyValue);

        cleanupUploadedLogo(req.file);

        // Only attempt rollback here if it wasn't already handled above
        if (organization && !organization.adminUserId) {
            await rollbackOrganizationCreation({ organization, adminUser, client });
        }

        if (error.code === 11000) {
            const duplicateField = error.keyValue ? Object.keys(error.keyValue)[0] : "unknown field";
            const duplicateValue = error.keyValue ? error.keyValue[duplicateField] : "unknown value";

            console.error(`Duplicate key conflict on field "${duplicateField}" with value:`, duplicateValue);

            const isDev = process.env.NODE_ENV !== "production";

            const duplicateResponse = {
                success: false,
                message: `An account or organization already exists with this ${duplicateField}`,
                data: {}
            };

            if (isDev) {
                duplicateResponse.debug = { duplicateField, duplicateValue };
            }

            return res.status(400).json(duplicateResponse);
        }

        const isDev = process.env.NODE_ENV !== "production";

        const errorResponse = {
            success: false,
            message: "Failed to create organization",
            data: {}
        };

        if (isDev) {
            errorResponse.debug = {
                name: error.name,
                message: error.message
            };

            if (error.errors) {
                errorResponse.debug.validationErrors = error.errors;
            }

            if (error.keyValue) {
                errorResponse.debug.duplicateKey = error.keyValue;
            }
        }

        return res.status(500).json(errorResponse);
    }
};

exports.getOrganizations = async (req, res) => {
    try {
        const { page = 1, limit = 50, status, search } = req.query;

        const filter = {};

        if (status) {
            filter.status = String(status).trim().toUpperCase();
        }

        if (search) {
            filter.organizationName = { $regex: String(search).trim(), $options: "i" };
        }

        const pageNum = Math.max(parseInt(page, 10) || 1, 1);
        const limitNum = Math.min(Math.max(parseInt(limit, 10) || 50, 1), 100);
        const skip = (pageNum - 1) * limitNum;

        const [total, organizations] = await Promise.all([
            Organization.countDocuments(filter),
            Organization.find(filter)
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limitNum)
        ]);

        return res.json({
            success: true,
            message: "Organizations fetched successfully",
            data: {
                organizations,
                pagination: {
                    total,
                    page: pageNum,
                    limit: limitNum,
                    pages: Math.ceil(total / limitNum) || 1
                }
            }
        });
    } catch (error) {
        console.error("Error fetching organizations:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to fetch organizations",
            data: {}
        });
    }
};

exports.getOrganizationById = async (req, res) => {
    try {
        const organization = await Organization.findById(req.params.id);

        if (!organization) {
            return res.status(404).json({
                success: false,
                message: "Organization not found",
                data: {}
            });
        }

        return res.json({
            success: true,
            message: "Organization fetched successfully",
            data: organization
        });
    } catch (error) {
        console.error("Error fetching organization:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to fetch organization",
            data: {}
        });
    }
};

exports.updateOrganization = async (req, res) => {
    try {
        const updateData = buildOrganizationUpdateData(req.body);
        const logo = buildLogoPayload(req.file);

        if (logo) {
            updateData.logo = logo;
        }

        if (Object.keys(updateData).length === 0) {
            cleanupUploadedLogo(req.file);
            return res.status(400).json({
                success: false,
                message: "At least one organization field or a logo file is required to update",
                data: {}
            });
        }

        const validationErrors = validateOrganizationInput(req.body, { requireAll: false });

        if (validationErrors.length > 0) {
            cleanupUploadedLogo(req.file);
            return res.status(400).json({
                success: false,
                message: validationErrors.join(", "),
                data: {}
            });
        }

        const organization = await Organization.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true, runValidators: true }
        );

        if (!organization) {
            cleanupUploadedLogo(req.file);
            return res.status(404).json({
                success: false,
                message: "Organization not found",
                data: {}
            });
        }

        if (organization.clientId) {
            const clientUpdate = {};

            if (updateData.organizationName) {
                clientUpdate.name = updateData.organizationName;
            }

            if (updateData.organizationAddress) {
                clientUpdate.description = updateData.organizationAddress;
            }

            if (Object.keys(clientUpdate).length > 0) {
                await Client.findByIdAndUpdate(organization.clientId, clientUpdate);
            }
        }

        return res.json({
            success: true,
            message: "Organization updated successfully",
            data: organization
        });
    } catch (error) {
        console.error("Error updating organization:", error);
        cleanupUploadedLogo(req.file);

        return res.status(500).json({
            success: false,
            message: "Failed to update organization",
            data: {}
        });
    }
};

exports.updateOrganizationStatus = async (req, res) => {
    try {
        const normalizedStatus = String(req.body.status || "")
            .trim()
            .toUpperCase();

        if (!ORGANIZATION_STATUSES.includes(normalizedStatus)) {
            return res.status(400).json({
                success: false,
                message: 'status must be "PENDING", "ACTIVE", or "INACTIVE"',
                data: {}
            });
        }

        const organization = await Organization.findByIdAndUpdate(
            req.params.id,
            { status: normalizedStatus },
            { new: true, runValidators: true }
        );

        if (!organization) {
            return res.status(404).json({
                success: false,
                message: "Organization not found",
                data: {}
            });
        }

        await syncOrganizationAdminStatus(organization, normalizedStatus);

        return res.json({
            success: true,
            message:
                normalizedStatus === "ACTIVE"
                    ? "Organization activated successfully"
                    : normalizedStatus === "INACTIVE"
                      ? "Organization deactivated successfully"
                      : "Organization status updated successfully",
            data: organization
        });
    } catch (error) {
        console.error("Error updating organization status:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to update organization status",
            data: {}
        });
    }
};

exports.activateOrganization = async (req, res) => {
    try {
        const organization = await Organization.findByIdAndUpdate(
            req.params.id,
            { status: "ACTIVE" },
            { new: true, runValidators: true }
        );

        if (!organization) {
            return res.status(404).json({
                success: false,
                message: "Organization not found",
                data: {}
            });
        }

        await syncOrganizationAdminStatus(organization, "ACTIVE");

        return res.json({
            success: true,
            message: "Organization activated successfully",
            data: organization
        });
    } catch (error) {
        console.error("Error activating organization:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to activate organization",
            data: {}
        });
    }
};

exports.deactivateOrganization = async (req, res) => {
    try {
        const organization = await Organization.findByIdAndUpdate(
            req.params.id,
            { status: "INACTIVE" },
            { new: true, runValidators: true }
        );

        if (!organization) {
            return res.status(404).json({
                success: false,
                message: "Organization not found",
                data: {}
            });
        }

        await syncOrganizationAdminStatus(organization, "INACTIVE");

        return res.json({
            success: true,
            message: "Organization deactivated successfully",
            data: organization
        });
    } catch (error) {
        console.error("Error deactivating organization:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to deactivate organization",
            data: {}
        });
    }
};

exports.deleteOrganization = async (req, res) => {
    try {
        const organization = await Organization.findById(req.params.id);

        if (!organization) {
            return res.status(404).json({
                success: false,
                message: "Organization not found",
                data: {}
            });
        }

        if (organization.adminUserId) {
            await Notification.deleteMany({ user: organization.adminUserId });
            await User.findByIdAndDelete(organization.adminUserId);
        }

        if (organization.clientId) {
            await Location.deleteMany({ clientId: organization.clientId });
            await Client.findByIdAndDelete(organization.clientId);
        }

        await Organization.findByIdAndDelete(req.params.id);

        return res.json({
            success: true,
            message: "Organization deleted successfully",
            data: {
                id: organization._id,
                organizationId: organization.organizationId,
                organizationName: organization.organizationName
            }
        });
    } catch (error) {
        console.error("Error deleting organization:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to delete organization",
            data: {}
        });
    }
};

exports.getMyOrganizationStatus = async (req, res) => {
    try {
        const organization = await ensureTenantOrganization(req.user.tenantId);

        if (!organization) {
            return res.status(404).json({
                success: false,
                message: "Organization not found",
                data: {}
            });
        }

        return res.json({
            success: true,
            message: "Organization status fetched successfully",
            data: {
                organizationId: organization.organizationId,
                organizationName: organization.organizationName,
                status: organization.status,
                logo: organization.logo || null,
                createdAt: organization.createdAt,
                updatedAt: organization.updatedAt
            }
        });
    } catch (error) {
        console.error("Error fetching organization status:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to fetch organization status",
            data: {}
        });
    }
};