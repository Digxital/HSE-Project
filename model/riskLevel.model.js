const mongoose = require("mongoose");

const riskLevelSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            unique: true,
            trim: true
        },
        severity: {
            type: Number,
            required: true,
            min: 1,
            max: 5
        },
        description: {
            type: String,
            trim: true
        },
        color: {
            type: String,
            trim: true
        }
    },
    { timestamps: true }
);

module.exports = mongoose.model("RiskLevel", riskLevelSchema);
