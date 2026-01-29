const bcrypt = require("bcryptjs");
const User = require("../model/user.model");

exports.createFieldUser = async (req, res) => {
    const { firstName, lastName, email, password } = req.body;

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
        role: "FIELD_USER"
    });

    res.status(201).json({ message: "Field user created successfully" });
};
