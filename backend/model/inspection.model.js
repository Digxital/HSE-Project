const mongoose = require("mongoose");

const inspectionSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true
    },
    template: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "InspectionTemplate"
    },
    location: {
      type: String,
      required: true
    },
    scheduledDate: {
      type: Date
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
    status: {
      type: String,
      enum: ["SCHEDULED", "IN_PROGRESS", "COMPLETED", "NON_COMPLIANT"],
      default: "SCHEDULED"
    },
    results: [
      {
        item: String,
        compliant: Boolean,
        remarks: String
      }
    ],
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Inspection", inspectionSchema);