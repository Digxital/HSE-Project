const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../model/user.model");
const { buildProfilePicPayload, deleteFile } = require("../utils/fileHandler");
const { formatUserWithLocation } = require("../utils/userLocation");
const {
    ensureTenantOrganization,
    formatOrganizationResponse
} = require("../utils/ensureTenantOrganization");
 // ─── Helpers ──────────────────────────────────────────────────────────────────

const signToken = (user) =>
    jwt.sign(
        {
            id: user._id,
            role: user.role,
            tenantId: user.tenantId,
        },
        process.env.JWT_SECRET,
        { expiresIn: "8h" }
    );


exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        // ── Validation ──────────────────────────────────────────────────────
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Email and password are required",
                data: null,
            });
        }

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password",
                data: {}
            });
        }

         // ── Account status checks ───────────────────────────────────────────
        if (user.status === "PENDING") {
            return res.status(403).json({
                success: false,
                message: "Your account is pending approval. Please contact your administrator.",
                data: null,
            });
        }
        if (user.status === "DEACTIVATED") {
            return res.status(403).json({
                success: false,
                message: "Your account has been deactivated. Please contact your administrator.",
                data: null,
            });
        }
        if (!user.role) {
            return res.status(403).json({
                success: false,
                message: "Your account has not been fully configured. Please contact your administrator.",
                data: null,
            });
        }


        if (user.status.toUpperCase() !== "ACTIVE") {
            return res.status(403).json({
                success: false,
                message: `Account is ${user.status}. Contact admin.`,
                data: {}
            });
        }

        const isMatch = await bcrypt.compare(password, user.passwordHash);

        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password",
                data: null
            });
        }

        const token = signToken(user);
        const formattedUser = await formatUserWithLocation(user);
        const organization = await ensureTenantOrganization(user.tenantId);
        const formattedOrganization = formatOrganizationResponse(organization);

        res.json({
            success: true,
            message: "Login successful",
            data: {
                token,
                role: user.role,
                user: formattedUser,
                organization: formattedOrganization
            }
        });
    } catch (error) {
        console.error("Login error:", error);
        return res.status(500).json({
            success: false,
            message: "Login failed. Try again.",
            data: {}
        });
    }
};

exports.updateProfile = async (req, res) => {
    try {
        const { firstName, lastName, location, phoneNumber } = req.body;
        const userId = req.user.id;
        const profilePic = buildProfilePicPayload(req.file);

        const hasTextUpdate =
            firstName !== undefined
            || lastName !== undefined
            || location !== undefined
            || phoneNumber !== undefined;

        if (!hasTextUpdate && !profilePic) {
            return res.status(400).json({
                success: false,
                message: "At least one of firstName, lastName, location, phoneNumber, or profilePic is required",
                data: {}
            });
        }

        if (firstName !== undefined && String(firstName).trim() === "") {
            return res.status(400).json({
                success: false,
                message: "firstName cannot be empty",
                data: {}
            });
        }

        if (lastName !== undefined && String(lastName).trim() === "") {
            return res.status(400).json({
                success: false,
                message: "lastName cannot be empty",
                data: {}
            });
        }

        const currentUser = await User.findById(userId).select("-passwordHash");

        if (!currentUser) {
            if (req.file?.path) {
                deleteFile(req.file.path);
            }
            return res.status(404).json({
                success: false,
                message: "User not found",
                data: {}
            });
        }

        const updateData = {};
        if (firstName !== undefined) updateData.firstName = String(firstName).trim();
        if (lastName !== undefined) updateData.lastName = String(lastName).trim();
        if (location !== undefined) updateData.location = String(location).trim();
        if (phoneNumber !== undefined) updateData.phoneNumber = String(phoneNumber).trim();
        if (profilePic) updateData.profilePic = profilePic;

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { $set: updateData },
            { new: true, runValidators: false }
        ).select("-passwordHash");

        if (!updatedUser) {
            return res.status(404).json({
                success: false,
                message: "User not found",
                data: {}
            });
        }

        const formattedUser = await formatUserWithLocation(updatedUser);

        res.json({
            success: true,
            message: "Profile updated successfully",
            data: {
                user: formattedUser
            }
        });
    } catch (error) {
        if (req.file?.path) {
            deleteFile(req.file.path);
        }
        console.error("Error updating profile:", error);
        res.status(500).json({
            success: false,
            message: "Error updating profile",
            data: {}
        });
    }
};

exports.getProfile = async (req, res) => {
    try {
        const userId = req.user.id;

        const user = await User.findById(userId).select("-passwordHash");

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
                data: {}
            });
        }

        const formattedUser = await formatUserWithLocation(user);

        res.json({
            success: true,
            message: "User details retrieved successfully",
            data: {
                user: formattedUser
            }
        });
    } catch (error) {
        console.error("Error fetching profile:", error);
        res.status(500).json({
            success: false,
            message: "Error fetching profile",
            data: {}
        });
    }
};