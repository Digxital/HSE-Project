const mongoose = require("mongoose");

const attachmentSchema = new mongoose.Schema(
    {
        type: {
            type: String,
            enum: ["photo", "video", "audio", "document"],
            required: true
        },
        filename: String,
        originalName: String,
        path: String,
        url: String,
        mimetype: String,
        size: Number,
        uploadedAt: Date
    },
    { _id: true }
);

const commentSchema = new mongoose.Schema(
    {
        text: {
            type: String,
            required: true
        },
        commentedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        commentedAt: {
            type: Date,
            required: true
        }
    },
    { _id: true }
);

const reportSchema = new mongoose.Schema(
    {
        tenantId: {
            type: mongoose.Schema.Types.ObjectId,
            index: true
        },
        recordType: {
            type: String,
            enum: ["incident", "hazard"],
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
            required: true,
            trim: true
        },

        eventTimePeriod: {
            type: String,
            enum: ["AM", "PM"]
        },

        eventTime24: {
            type: String,
            trim: true
        },

        peopleAffected: {
            type: Number,
            default: 0
        },

        injuryDetails: String,
        equipmentInvolved: String,

        attachments: [attachmentSchema],

        reportedBy: {
            userId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
                required: true
            },
            role: {
                type: String,
                enum: ["FIELD_USER", "SUPERVISOR", "HSE_OFFICER"],
                required: true
            }
        },

        status: {
            type: String,
            enum: ["open", "in_progress", "action_required", "completed", "over_due"],
            default: "open"
        },

        comments: [commentSchema],

        adminComment: {
            type: [commentSchema],
            default: undefined
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
 