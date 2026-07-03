const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const axios = require("axios");
const User = require("../model/user.model");
const { logLogin, getClientIp, getUserAgent } = require("../utils/auditLog");
 

exports.adminRegister = async (req, res) => {
    const { firstName, lastName, email, password } = req.body;

    const exists = await User.findOne({ email });
    if (exists) {
        return res.status(400).json({
            success: false,
            message: "Admin already exists",
            data: {}
        }); 
    }

    const passwordHash = await bcrypt.hash(password, 10);

    await User.create({
        tenantId: new mongoose.Types.ObjectId(),
        firstName,
        lastName,
        email,
        passwordHash,
        role: "ADMIN",
        status: "ACTIVE"
    });

    res.status(201).json({
        success: true,
        message: "Admin registered successfully",
        data: { email }
    });
}; 
 
exports.adminLogin = async (req, res) => {
    const { email, password } = req.body;
  
    const user = await User.findOne({ email });
    if (!user || user.role !== "ADMIN") {
        // Log failed login attempt
        await logLogin({
            tenantId: user?.tenantId || null,
            userId: user?._id || null,
            userEmail: email,
            success: false,
            req,
            statusMessage: "Invalid admin credentials"
        });
        return res.status(401).json({
            success: false,
            message: "Invalid admin credentials",
            data: {}
        });
    }

    if (user.status !== "ACTIVE") {
        // Log failed login attempt
        await logLogin({
            tenantId: user.tenantId,
            userId: user._id,
            userEmail: email,
            success: false,
            req,
            statusMessage: "Account is not active"
        });
        return res.status(403).json({
            success: false,
            message: "Account is not active. Contact admin.",
            data: {}
        });
    }

    const match = await bcrypt.compare(password, user.passwordHash);
    if (!match) {
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
            message: "Invalid admin credentials",
            data: {}
        });
    }

    // Generate access token (short-lived)
    const accessToken = jwt.sign(
        {
            id: user._id,
            email: user.email,
            name: user.name || user.email.split('@')[0], // Use name if available, or derive from email
            role: user.role,
            tenantId: user.tenantId
        },
        process.env.JWT_SECRET,
        { expiresIn: "8h" }
    );

    // Generate refresh token (long-lived)
    const refreshToken = jwt.sign(
        {
            id: user._id,
            tokenVersion: user.tokenVersion || 1 // Optional: for token invalidation
        },
        process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET,
        { expiresIn: "7d" }
    );
    
    // Optional: Store refresh token in database
    if (user) {
        user.refreshToken = refreshToken;
        await user.save();
    }
    // Log successful admin login
    await logLogin({
        tenantId: user.tenantId,
        userId: user._id,
        userEmail: email,
        success: true,
        req
    });
    res.json({
        accessToken,
        refreshToken,
        user: {
            id: user._id,
            email: user.email,
            name: user.name || user.email.split('@')[0],
            role: user.role
        }
    });
};

exports.adminMicrosoftLogin = async (req, res) => {
    const { accessToken: microsoftAccessToken } = req.body;

    if (!microsoftAccessToken) {
        return res.status(400).json({
            success: false,
            message: "Microsoft access token is required",
            data: {}
        });
    }

    try {
        const profileResponse = await axios.get(
            "https://graph.microsoft.com/v1.0/me",
            {
                headers: {
                    Authorization: `Bearer ${microsoftAccessToken}`,
                },
            }
        );

        const microsoftUser = profileResponse.data;
        const email =
            microsoftUser.mail ||
            microsoftUser.userPrincipalName ||
            "";

        if (!email) {
            return res.status(400).json({
                success: false,
                message: "Unable to determine Microsoft account email",
                data: {}
            });
        }

        const user = await User.findOne({
            email: email.toLowerCase(),
        });

        if (!user || user.role !== "SUPERVISOR" && user.role !== "ADMIN") {
            return res.status(403).json({
                success: false,
                message: "This Microsoft account is not authorized for supervisor access",
                data: {}
            });
        }

        if (user.status !== "ACTIVE") {
            return res.status(403).json({
                success: false,
                message: "Account is not active. Contact admin.",
                data: {}
            });
        }

        const accessToken = jwt.sign(
            {
                id: user._id,
                email: user.email,
                name: user.name || `${user.firstName} ${user.lastName}`.trim(),
                role: user.role,
                tenantId: user.tenantId
            },
            process.env.JWT_SECRET,
            { expiresIn: "8h" }
        );

        const refreshToken = jwt.sign(
            {
                id: user._id,
                tokenVersion: user.tokenVersion || 1
            },
            process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        user.refreshToken = refreshToken;
        await user.save();

        return res.json({
            accessToken,
            refreshToken,
            user: {
                id: user._id,
                email: user.email,
                name: user.name || `${user.firstName} ${user.lastName}`.trim(),
                role: user.role
            }
        });
    } catch (error) {
        console.error("Microsoft admin login error:", error.response?.data || error.message);
        return res.status(401).json({
            success: false,
            message: "Microsoft authentication failed",
            data: error.response?.data || {}
        });
    }
};

exports.adminLogout = async (req, res) => {
    try {
        const { refreshToken } = req.body;
        
        if (refreshToken) {
            // Find user with this refresh token and remove it
            await User.findOneAndUpdate(
                { refreshToken },
                { $unset: { refreshToken: 1 } }
            );
        }
        
        res.json({ 
            success: true,
            message: "Logged out successfully" 
        });
    } catch (error) {
        console.error("Logout error:", error);
        res.status(500).json({ 
            success: false,
            message: "Error during logout" 
        });
    }
};
