const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        superAdmin: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "SuperAdmin"
        },
        type: {
            type: String,
            enum: [
                "user_added",
                "report_submitted",
                "report_commented",
                "action_closed",
                "action_progress",
                "certificate_added",
                "certificate_updated",
                "action_assigned",
                "incident_assigned",
                "inspection_assigned",
                "organization_created",
                "demo_request_submitted"
            ],
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

notificationSchema.pre("validate", function (next) {
    if (!this.user && !this.superAdmin) {
        next(new Error("Either user or superAdmin is required"));
    } else {
        next();
    }
});

notificationSchema.index({ superAdmin: 1, createdAt: -1 });

module.exports = mongoose.model("Notification", notificationSchema); 