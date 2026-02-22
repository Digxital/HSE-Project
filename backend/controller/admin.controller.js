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

exports.getUsers = async (req, res) => {
    try {
        const users = await User.find().select("-passwordHash");

        return res.json({
            success: true,
            message: "Users fetched successfully",
            data: users
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to fetch users",
            data: {}
        });
    }
};

exports.getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select("-passwordHash");

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
                data: {}
            });
        }

        return res.json({
            success: true,
            message: "User fetched successfully",
            data: user
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: "Invalid ID",
            data: {}
        });
    }
};

exports.updateUser = async (req, res) => {
    try {
        const { name, email, role } = req.body;

        const user = await User.findByIdAndUpdate(
            req.params.id,
            { name, email, role },
            { new: true, runValidators: true }
        ).select("-password");

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
                data: {}
            });
        }

        return res.json({
            success: true,
            message: "User updated successfully",
            data: user
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: "Failed to update user",
            data: {}
        });
    }
};

exports.deleteUser = async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
                data: {}
            });
        }

        return res.json({
            success: true,
            message: "User deleted successfully",
            data: {}
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: "Invalid ID",
            data: {}
        });
    }
};

