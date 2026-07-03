const mongoose = require("mongoose");

const organizationSchema = new mongoose.Schema(
    {
        organizationName: {
            type: String,
            required: true,
            trim: true
        },
        organizationId: {
            type: String,
            required: true,
            unique: true,
            trim: true
        },
        primaryContactPersonName: {
            type: String,
            required: true,
            trim: true
        },
        contactEmail: {
            type: String,
            required: true,
            trim: true,
            lowercase: true
        },
        contactPhoneNumber: {
            type: String,
            required: true,
            trim: true
        },
        organizationAddress: {
            type: String,
            required: true,
            trim: true
        },
        logo: {
            url: String,
            filename: String,
            originalName: String,
            mimetype: String,
            size: Number,
            uploadedAt: Date
        },
        status: {
            type: String,
            enum: ["PENDING", "ACTIVE", "INACTIVE"],
            default: "PENDING"
        },
        adminUserId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }
    },
    { timestamps: true }
);

module.exports = mongoose.model("Organization", organizationSchema);
