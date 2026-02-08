const mongoose = require("mongoose");

const reportSchema = new mongoose.Schema(
    {
        recordCategory: {
            type: String,
            enum: ["hazard", "observation", "incident"],
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

        riskLevel: {
            type: String,
            enum: ["low", "medium", "high", "critical"],
            required: true
        },

        location: {
            clientId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Client",
                required: true
            },
            siteId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Location",
                required: true
            },
            specificArea: {
                type: String
            },
            latitude: Number,
            longitude: Number
        },

        eventDate: {
            type: Date,
            required: true
        },

        eventTime: {
            type: String,
            required: true
        },

        peopleAffected: {
            type: Number,
            default: 0
        },

        injuryDetails: String,
        equipmentInvolved: String,

        attachments: [
            {
                type: {
                    type: String,
                    enum: ["photo", "video", "audio"]
                },
                url: String
            }
        ],

        reportedBy: {
            userId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
                required: true
            },
            role: {
                type: String,
                enum: ["FIELD_USER", "SUPERVISOR"],
                required: true
            }
        },

        status: {
            type: String,
            enum: ["open", "under_review", "action_required", "closed"],
            default: "open"
        },

        deviceMeta: {
            deviceId: String,
            os: String,
            appVersion: String
        }
    },
    { timestamps: true }
);

module.exports = mongoose.model("Report", reportSchema);
