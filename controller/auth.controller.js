const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../model/user.model");
const { logLogin, logProfileUpdate, getClientIp, getUserAgent } = require("../utils/auditLog");

exports.login = async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
        // Log failed login attempt
        await logLogin({
            tenantId: null,
            userId: null,
            userEmail: email,
            success: false,
            req,
            statusMessage: "User not found"
        });
        return res.status(401).json({
            success: false,
            message: "Invalid credentials",
            data: {}
        });
    }

    if (user.status.toUpperCase() !== "ACTIVE") {
        // Log failed login attempt
        await logLogin({
            tenantId: user.tenantId,
            userId: user._id,
            userEmail: email,
            success: false,
            req,
            statusMessage: `Account is ${user.status}`
        });
        return res.status(403).json({
            success: false,
            message: `Account is ${user.status}. Contact admin.`,
            data: {}
        });
    }

    if (!user.role) {
        // Log failed login attempt
        await logLogin({
            tenantId: user.tenantId,
            userId: user._id,
            userEmail: email,
            success: false,
            req,
            statusMessage: "Account not fully configured"
        });
        return res.status(403).json({
            success: false,
            message: "Account not fully configured. Contact admin.",
            data: {}
        });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);

    if (!isMatch) {
        // Log failed login attempt
        await logLogin({
            tenantId: user.tenantId,
            userId: user._id,
            userEmail: email,
            success: false,
            req,
            statusMessage: "Invalid password"
        });
        return res.status(401).json({
            success: false,
            message: "Invalid credentials",
            data: {}
        });
    }

    const token = jwt.sign(
        {
            id: user._id,
            email: user.email,
            role: user.role,
            tenantId: user.tenantId
        },
        process.env.JWT_SECRET,
        { expiresIn: "8h" }
    );

    // Log successful login
    await logLogin({
        tenantId: user.tenantId,
        userId: user._id,
        userEmail: email,
        success: true,
        req
    });

    res.json({
        success: true,
        message: "Login successful",
        data: {
            token,
            role: user.role
        }
    });
};

exports.updateProfile = async (req, res) => {
    try {
        const { firstName, lastName, location } = req.body;
        const userId = req.user.id;

        // Validate that firstName and lastName are provided
        if (!firstName || !lastName) {
            return res.status(400).json({
                success: false,
                message: "firstName and lastName are required",
                data: {}
            });
        }

        // Validate that they are not empty strings
        if (firstName.trim() === "" || lastName.trim() === "") {
            return res.status(400).json({
                success: false,
                message: "firstName and lastName cannot be empty",
                data: {}
            });
        }

        // Get current user data before update
        const currentUser = await User.findById(userId).select("-passwordHash");

        // Build update object
        const updateData = { firstName, lastName };
        if (location !== undefined) {
            // Only set location if it's provided and not an empty string
            updateData.location = location.trim();
        }

        // Update user profile
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            updateData,
            { new: true, runValidators: true }
        ).select("-passwordHash");

        // Log profile update
        await logProfileUpdate({
            tenantId: req.user.tenantId,
            userId,
            userEmail: req.user.email || currentUser.email,
            before: {
                firstName: currentUser.firstName,
                lastName: currentUser.lastName,
                location: currentUser.location
            },
            after: {
                firstName: updatedUser.firstName,
                lastName: updatedUser.lastName,
                location: updatedUser.location
            },
            req
        });

        res.json({
            success: true,
            message: "Profile updated successfully",
            data: {
                user: updatedUser
            }
        });
    } catch (error) {
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

        res.json({
            success: true,
            message: "User details retrieved successfully",
            data: {
                user: user
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