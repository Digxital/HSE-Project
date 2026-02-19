const mongoose = require("mongoose");

const historySchema = new mongoose.Schema(
  {
    action: { type: String, required: true },
    performedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    timestamp: { type: Date, default: Date.now }
  },
  { _id: false }
);

const incidentSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    location: { type: String, required: true },

    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "IncidentCategory",
      required: true
    },

    riskLevel: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "RiskLevel",
      required: true
    },

    status: {
      type: String,
      enum: ["OPEN", "IN_PROGRESS", "RESOLVED", "CLOSED", "ESCALATED"],
      default: "OPEN"
    },

    reportedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },

    attachments: [String],

    history: [historySchema]
  },
  { timestamps: true }
);

module.exports = mongoose.model("Incident", incidentSchema);
