const mongoose = require("mongoose");

const reportActionSchema = new mongoose.Schema(
    {
        tenantId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            index: true
        },
        report: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Report",
            required: true,
            index: true
        },
        actionTitle: {
            type: String,
            required: true,
            trim: true
        },
        assignedTo: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true
        },
        dueDate: {
            type: Date
        },
        priority: {
            type: String,
            enum: ["Low", "Medium", "High", "Critical"],
            default: "Medium"
        },
        description: {
            type: String,
            trim: true
        },
        status: {
            type: String,
            enum: ["open", "in_progress", "completed", "over_due"],
            default: "open",
            index: true
        },
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        completedAt: {
            type: Date,
            default: null
        }
    },
    { timestamps: true }
);

reportActionSchema.index({ tenantId: 1, assignedTo: 1, status: 1 });
reportActionSchema.index({ tenantId: 1, report: 1, createdAt: -1 });

module.exports = mongoose.model("ReportAction", reportActionSchema);
