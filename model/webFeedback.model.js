const mongoose = require("mongoose");

const webFeedbackSchema = new mongoose.Schema(
    {
        rating: {
            type: Number,
            required: true,
            min: 1,
            max: 5,
        },

        type: {
            type: String,
            enum: [
                "General Experience",
                "Report a Bug",
                "Something Felt Off",
            ],
            required: true,
        },

        message: {
            type: String,
            trim: true,
            default: "",
        },

        submittedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("WebFeedback", webFeedbackSchema);