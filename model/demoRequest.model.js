const mongoose = require("mongoose");

const demoRequestSchema = new mongoose.Schema(
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
            required: true,
            trim: true,
            lowercase: true
        },
        phone: {
            type: String,
            required: true,
            trim: true
        },
        company: {
            type: String,
            required: true,
            trim: true
        },
        jobTitle: {
            type: String,
            required: true,
            trim: true
        },
        country: {
            type: String,
            required: true,
            trim: true
        },
        message: {
            type: String,
            trim: true,
            default: ""
        },
        requestedAt: {
            type: Date,
            required: true,
            default: Date.now
        }
    },
    { timestamps: true }
);

module.exports = mongoose.model("DemoRequest", demoRequestSchema);
