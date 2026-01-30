const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../model/user.model");

exports.login = async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
        return res.status(401).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
        return res.status(401).json({ message: "Invalid credentials" });
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
        token,
        role: user.role
    });
};
