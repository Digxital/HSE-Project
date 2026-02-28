const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../model/user.model");

exports.login = async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
        return res.status(401).json({
            success: false,
            message: "Invalid credentials",
            data: {}
        });
    }

    if (user.status !== "ACTIVE") {
        return res.status(403).json({
            success: false,
            message: `Account is ${user.status}. Contact admin.`,
            data: {}
        });
    }

    if (!user.role) {
        return res.status(403).json({
            success: false,
            message: "Account not fully configured. Contact admin.",
            data: {}
        });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);

    if (!isMatch) {
        return res.status(401).json({
            success: false,
            message: "Invalid credentials",
            data: {}
        });
    }

    const token = jwt.sign(
        {
            id: user._id,
            role: user.role,
            tenantId: user.tenantId
        },
        process.env.JWT_SECRET,
        { expiresIn: "8h" }
    );

    res.json({
        success: true,
        message: "Login successful",
        data: {
            token,
            role: user.role
        }
    });
};