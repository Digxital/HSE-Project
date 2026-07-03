const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const SuperAdmin = require("../model/superAdmin.model");
const { buildProfilePicPayload, deleteFile } = require("../utils/fileHandler");

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const formatSuperAdminResponse = (superAdmin) => ({
    id: superAdmin._id,
    firstName: superAdmin.firstName,
    lastName: superAdmin.lastName,
    email: superAdmin.email,
    role: superAdmin.role,
    status: superAdmin.status,
    profilePic: superAdmin.profilePic || null,
    createdAt: superAdmin.createdAt,
    updatedAt: superAdmin.updatedAt
});

const validateRegisterInput = (body) => {
    const { firstName, lastName, email, password } = body;
    const errors = [];

    if (!firstName || !String(firstName).trim()) {
        errors.push("firstName is required");
    }

    if (!lastName || !String(lastName).trim()) {
        errors.push("lastName is required");
    }

    if (!email || !String(email).trim()) {
        errors.push("email is required");
    } else if (!EMAIL_PATTERN.test(String(email).trim())) {
        errors.push("email must be a valid email address");
    }

    if (!password || !String(password).trim()) {
        errors.push("password is required");
    }

    return errors;
};

exports.superAdminRegister = async (req, res) => {
    try {
        const validationErrors = validateRegisterInput(req.body);

        if (validationErrors.length > 0) {
            return res.status(400).json({
                success: false,
                message: validationErrors.join(", "),
                data: {}
            });
        }

        const { firstName, lastName, email, password } = req.body;
        const normalizedEmail = String(email).trim().toLowerCase();

        const exists = await SuperAdmin.findOne({ email: normalizedEmail });
        if (exists) {
            return res.status(400).json({
                success: false,
                message: "Super admin already exists with this email",
                data: {}
            });
        }

        const passwordHash = await bcrypt.hash(String(password), 10);

        const superAdmin = await SuperAdmin.create({
            firstName: String(firstName).trim(),
            lastName: String(lastName).trim(),
            email: normalizedEmail,
            passwordHash,
            role: "SUPERADMIN",
            status: "ACTIVE"
        });

        return res.status(201).json({
            success: true,
            message: "Super admin registered successfully",
            data: formatSuperAdminResponse(superAdmin)
        });
    } catch (error) {
        console.error("Error registering super admin:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to register super admin",
            data: {}
        });
    }
};

exports.superAdminLogin = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "email and password are required",
                data: {}
            });
        }

        const normalizedEmail = String(email).trim().toLowerCase();
        const superAdmin = await SuperAdmin.findOne({ email: normalizedEmail });

        if (!superAdmin || superAdmin.role !== "SUPERADMIN") {
            return res.status(401).json({
                success: false,
                message: "Invalid super admin credentials",
                data: {}
            });
        }

        if (superAdmin.status !== "ACTIVE") {
            return res.status(403).json({
                success: false,
                message: "Account is not active. Contact support.",
                data: {}
            });
        }

        const isMatch = await bcrypt.compare(String(password), superAdmin.passwordHash);
        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: "Invalid super admin credentials",
                data: {}
            });
        }

        const token = jwt.sign(
            {
                id: superAdmin._id,
                email: superAdmin.email,
                role: superAdmin.role
            },
            process.env.JWT_SECRET,
            { expiresIn: "8h" }
        );

        return res.json({
            success: true,
            message: "Login successful",
            data: {
                token,
                user: formatSuperAdminResponse(superAdmin)
            }
        });
    } catch (error) {
        console.error("Error logging in super admin:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to login super admin",
            data: {}
        });
    }
};

exports.getSuperAdminProfile = async (req, res) => {
    try {
        const superAdmin = await SuperAdmin.findById(req.superAdmin.id);

        if (!superAdmin) {
            return res.status(404).json({
                success: false,
                message: "Super admin not found",
                data: {}
            });
        }

        return res.json({
            success: true,
            message: "Profile fetched successfully",
            data: formatSuperAdminResponse(superAdmin)
        });
    } catch (error) {
        console.error("Error fetching super admin profile:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to fetch profile",
            data: {}
        });
    }
};

exports.updateSuperAdminProfile = async (req, res) => {
    try {
        const { firstName, lastName, currentPassword, newPassword } = req.body;
        const profilePic = buildProfilePicPayload(req.file);

        if (
            firstName === undefined
            && lastName === undefined
            && newPassword === undefined
            && !profilePic
        ) {
            return res.status(400).json({
                success: false,
                message: "At least one of firstName, lastName, newPassword, or profilePic is required",
                data: {}
            });
        }

        const superAdmin = await SuperAdmin.findById(req.superAdmin.id);

        if (!superAdmin) {
            return res.status(404).json({
                success: false,
                message: "Super admin not found",
                data: {}
            });
        }

        const updateData = {};

        if (firstName !== undefined) {
            if (!String(firstName).trim()) {
                return res.status(400).json({
                    success: false,
                    message: "firstName cannot be empty",
                    data: {}
                });
            }
            updateData.firstName = String(firstName).trim();
        }

        if (lastName !== undefined) {
            if (!String(lastName).trim()) {
                return res.status(400).json({
                    success: false,
                    message: "lastName cannot be empty",
                    data: {}
                });
            }
            updateData.lastName = String(lastName).trim();
        }

        if (newPassword !== undefined) {
            if (!String(newPassword).trim()) {
                return res.status(400).json({
                    success: false,
                    message: "newPassword cannot be empty",
                    data: {}
                });
            }

            if (!currentPassword) {
                return res.status(400).json({
                    success: false,
                    message: "currentPassword is required to change password",
                    data: {}
                });
            }

            const isMatch = await bcrypt.compare(
                String(currentPassword),
                superAdmin.passwordHash
            );

            if (!isMatch) {
                return res.status(401).json({
                    success: false,
                    message: "Current password is incorrect",
                    data: {}
                });
            }

            updateData.passwordHash = await bcrypt.hash(String(newPassword), 10);
        }

        if (profilePic) {
            updateData.profilePic = profilePic;
        }

        const updatedSuperAdmin = await SuperAdmin.findByIdAndUpdate(
            req.superAdmin.id,
            updateData,
            { new: true, runValidators: true }
        );

        return res.json({
            success: true,
            message: "Profile updated successfully",
            data: formatSuperAdminResponse(updatedSuperAdmin)
        });
    } catch (error) {
        if (req.file?.path) {
            deleteFile(req.file.path);
        }
        console.error("Error updating super admin profile:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to update profile",
            data: {}
        });
    }
};
