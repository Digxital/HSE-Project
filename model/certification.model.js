const mongoose = require("mongoose");

const certificationSchema = new mongoose.Schema(
  {
    tenantId: {
      type: mongoose.Schema.Types.ObjectId,
      index: true
    },
    externalId: {
      type: String,
      trim: true
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    certificationName: {
      type: String,
      required: true,
      trim: true
    },
    issuingAuthority: {
      type: String,
      trim: true
    },
    issueDate: {
      type: Date,
      required: true
    },
    expiryDate: {
      type: Date,
      required: true
    },
    fileUrl: {
      type: String,
      trim: true
    },
    file: {
      filename: String,
      originalName: String,
      path: String,
      mimetype: String,
      size: Number,
      uploadedAt: Date
    },
    status: {
      type: String,
      enum: ["VALID", "EXPIRED"],
      default: "VALID"
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Certification", certificationSchema);
