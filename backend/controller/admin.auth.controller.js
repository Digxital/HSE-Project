const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../model/user.model");


exports.adminRegister = async (req, res) => {
    const { firstName, lastName, email, password } = req.body;

    const exists = await User.findOne({ email });
    if (exists) {
        return res.status(400).json({ message: "Admin already exists" });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    await User.create({
        tenantId: new mongoose.Types.ObjectId(),
        firstName,
        lastName,
        email,
        passwordHash,
        role: "ADMIN"
    }); 

    res.status(201).json({
        message: "Admin registered successfully",
        email
    });
}; 

exports.adminLogin = async (req, res) => {
    const { email, password } = req.body;
 
    const user = await User.findOne({ email });
    if (!user || user.role !== "ADMIN") {
        return res.status(401).json({ message: "Invalid admin credentials" });
    }

    const match = await bcrypt.compare(password, user.passwordHash);
    if (!match) {
        return res.status(401).json({ message: "Invalid admin credentials" });
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
