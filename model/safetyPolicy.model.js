const mongoose = require("mongoose");

const safetyPolicySchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            unique: true,
            trim: true
        },
        content: {
            type: String,
            required: true
        },
        version: {
            type: String,
            trim: true
        },
        effectiveDate: {
            type: Date
        }
    },
    { timestamps: true }
);

module.exports = mongoose.model("SafetyPolicy", safetyPolicySchema);
