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
        role: "ADMIN"
    });
};