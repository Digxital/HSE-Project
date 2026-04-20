const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        type: {
            type: String,
            enum: ["user_added", "report_submitted", "action_closed", "action_progress", "certificate_added", "certificate_updated"],
            required: true
        },
        title: {
            type: String,
            required: true
        },
        description: {
            type: String,
            required: true
        },
        read: {
            type: Boolean,
            default: false
        },
        data: {
            type: mongoose.Schema.Types.Mixed
        }
    },
    { timestamps: true }
);

module.exports = mongoose.model("Notification", notificationSchema);