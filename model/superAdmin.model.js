const mongoose = require("mongoose");

const superAdminSchema = new mongoose.Schema(
    {
        firstName: {
            type: String,
            required: true,
            trim: true
        },
        lastName: {
            type: String,
            required: true,
            trim: true
        },
        email: {
            type: String,
            unique: true,
            required: true,
            trim: true,
            lowercase: true
        },
        passwordHash: {
            type: String,
            required: true
        },
        role: {
            type: String,
            enum: ["SUPERADMIN"],
            default: "SUPERADMIN"
        },
        status: {
            type: String,
            enum: ["ACTIVE", "DEACTIVATED"],
            default: "ACTIVE"
        },
        profilePic: {
            url: String,
            filename: String,
            originalName: String,
            mimetype: String,
            size: Number,
            uploadedAt: Date
        }
    },
    { timestamps: true }
);

module.exports = mongoose.model("SuperAdmin", superAdminSchema);
