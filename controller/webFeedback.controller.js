const WebFeedback = require("../model/webFeedback.model");

exports.submitFeedback = async (req, res) => {
    try {
        const { rating, type, message } = req.body;


        if (!rating || !type) {
            return res.status(400).json({
                success: false,
                message: "Rating and type are required",
                data: {},
            });
        }

        const feedback = await WebFeedback.create({
            rating,
            type,
            message,
            submittedBy: req.user.id,
        });

        return res.status(201).json({
            success: true,
            message: "Feedback submitted successfully",
            data: feedback,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
            data: {},
        });
    }
};

exports.getAllFeedback = async (req, res) => {
    try {
        const feedbacks = await WebFeedback.find()
            .populate("submittedBy", "name email role")
            .sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            message: "Feedback fetched successfully",
            data: feedbacks,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
            data: {},
        });
    }
};