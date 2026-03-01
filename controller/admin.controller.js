const bcrypt = require("bcryptjs");
const User = require("../model/user.model");

// ADMIN can create users with or without a role

exports.createUser = async (req, res) => {
    const { firstName, lastName, email, password, role } = req.body;

    const exists = await User.findOne({ email });
    if (exists) {
        return res.status(400).json({ message: "User already exists" });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const newUser = await User.create({
        tenantId: req.user.tenantId,
        firstName,
        lastName,
        email,
        passwordHash,
        role: role || null,
        status: "PENDING"
    });

    res.status(201).json({
        success: true,
        message: role ? `${role} created successfully` : "User created successfully",
        data: {
            id: newUser._id
        }
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
        const { firstName, lastName, email, role } = req.body;

        const user = await User.findByIdAndUpdate(
            req.params.id,
            { firstName, lastName, email, role },
            { new: true, runValidators: true }
        ).select("-passwordHash");

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

exports.deactivateUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
                data: {}
            });
        }

        user.status = "INACTIVE";
        await user.save();

        return res.json({
            success: true,
            message: "User deactivated successfully",
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

exports.activateUser = async (req, res) => {
    try {
        const { role } = req.body;

        // Validate role assignment
        if (!role || !["SUPERVISOR", "FIELD_USER", "HSE_OFFICER"].includes(role)) {
            return res.status(400).json({
                success: false,
                message: "Role must be assigned before activation.",
                data: {}
            });
        }

        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
                data: {}
            });
        }

        user.role = role;
        user.status = "ACTIVE";
        await user.save();

        return res.json({
            success: true,
            message: "User activated successfully",
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