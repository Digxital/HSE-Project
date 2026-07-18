const mongoose = require("mongoose");

const fcmTokenSchema = new mongoose.Schema(
    {
        token: {
            type: String,
            required: true,
        },
        platform: {
            type: String,
            enum: ["android", "ios", "web"],
            default: "android",
        },
        registeredAt: {
            type: Date,
            default: Date.now,
        },
    },
    { _id: false }
);

const userSchema = new mongoose.Schema(
  {
    tenantId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true
    },
    firstName: {
      type: String,
      required: true
    },
    lastName: {
      type: String,
      required: true
    },
    email: {
      type: String,
      unique: true,
      required: true,
      lowercase: true,
      trim: true,
    },
    phoneNumber: {
      type: String,
      trim: true,
      default: ""
    },
    passwordHash: {
      type: String,
      required: true
    },
    role: {
      type: String,
      enum: ["ADMIN", "SUPERVISOR", "FIELD_USER", "HSE_OFFICER"],
      default: null
    },
    status: {
      type: String,
      enum: ["PENDING", "ACTIVE", "DEACTIVATED"],
      default: "PENDING"
    },
    location: {
      type: String,
      default: ""
    },
    isUnderInvestigation: {
      type: Boolean,
      default: false
    },
    fcmTokens: {
        type: [fcmTokenSchema],
        default: [],
    },
    profilePic: {
      url: String,
      filename: String,
      originalName: String,
      mimetype: String,
      size: Number,
      uploadedAt: Date
    },
  },
  { timestamps: true }
);

// ─── Indexes ─────────────────────────────────────────────────────────────────
userSchema.index({ "fcmTokens.token": 1 });
userSchema.index({ tenantId: 1, status: 1 });

// ─── Helper: get all raw token strings ───────────────────────────────────────
userSchema.methods.getFcmTokenStrings = function () {
    return this.fcmTokens.map((t) => t.token);
};

module.exports = mongoose.model("User", userSchema);