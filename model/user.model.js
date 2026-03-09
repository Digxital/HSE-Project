const mongoose = require("mongoose");

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
      required: true
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
      enum: ["PENDING", "ACTIVE", "USER_DEACTIVATED"],
      default: "PENDING"
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);