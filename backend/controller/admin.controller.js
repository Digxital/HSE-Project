const bcrypt = require("bcryptjs");
const User = require("../model/user.model");

// ADMIN only Can create SUPERVISOR or FIELD_USER

exports.createUser = async (req, res) => {
    const { firstName, lastName, email, password, role } = req.body;

    // Admin can only create these roles
    if (!["SUPERVISOR", "FIELD_USER"].includes(role)) {
        return res.status(400).json({
            message: "Admin can only create Supervisor or Field User"
        });
    }

    const exists = await User.findOne({ email });
    if (exists) {
        return res.status(400).json({ message: "User already exists" });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    await User.create({
        tenantId: req.user.tenantId,
        firstName,
        lastName,
        email,
        passwordHash,
        role
    });

    res.status(201).json({
        message: `${role} created successfully`
    });
};
