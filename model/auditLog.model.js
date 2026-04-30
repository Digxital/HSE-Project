const mongoose = require("mongoose");

const auditLogSchema = new mongoose.Schema(
  {
    tenantId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      index: true
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },
    userEmail: {
      type: String,
      required: true
    },
    action: {
      type: String,
      enum: [
        "LOGIN",
        "LOGIN_FAILED",
        "LOGOUT",
        "USER_CREATED",
        "USER_UPDATED",
        "USER_DELETED",
        "ROLE_CHANGED",
        "PERMISSION_CHANGED",
        "CERTIFICATION_UPLOADED",
        "CERTIFICATION_DELETED",
        "RECORD_DELETED",
        "STATUS_CHANGED",
        "PASSWORD_CHANGED",
        "PROFILE_UPDATED"
      ],
      required: true,
      index: true
    },
    resourceType: {
      type: String,
      enum: [
        "USER",
        "CERTIFICATION",
        "INCIDENT",
        "INSPECTION",
        "REPORT",
        "LOCATION",
        "CLIENT",
        "CONFIG",
        "OTHER"
      ],
      required: true
    },
    resourceId: {
      type: mongoose.Schema.Types.ObjectId,
      default: null
    },
    resourceName: {
      type: String,
      default: null
    },
    description: {
      type: String,
      required: true
    },
    details: {
      type: mongoose.Schema.Types.Mixed,
      default: {}
    },
    // Changes made (before/after for updates)
    changes: {
      before: {
        type: mongoose.Schema.Types.Mixed,
        default: {}
      },
      after: {
        type: mongoose.Schema.Types.Mixed,
        default: {}
      }
    },
    // Login information
    ipAddress: {
      type: String,
      default: null
    },
    userAgent: {
      type: String,
      default: null
    },
    status: {
      type: String,
      enum: ["SUCCESS", "FAILURE"],
      default: "SUCCESS"
    },
    statusMessage: {
      type: String,
      default: null
    }
  },
  {
    timestamps: true,
    indexes: [
      { tenantId: 1, createdAt: -1 },
      { userId: 1, createdAt: -1 },
      { action: 1, createdAt: -1 },
      { resourceType: 1, createdAt: -1 }
    ]
  }
);

module.exports = mongoose.model("AuditLog", auditLogSchema);
