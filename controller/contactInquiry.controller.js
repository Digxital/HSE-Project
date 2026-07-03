const Contact = require("../model/contactInquiry.model");

exports.submitContactForm = async (req, res) => {
    try {
        const {
            name,
            email,
            phoneNumber,
            subject,
            message,
        } = req.body;

        if (
            !name ||
            !email ||
            !phoneNumber ||
            !subject ||
            !message
        ) {
            return res.status(400).json({
                success: false,
                message: "All fields are required",
            });
        }

        const contact = await Contact.create({
            name,
            email,
            phoneNumber,
            subject,
            message,
        });

        return res.status(201).json({
            success: true,
            message: "Message submitted successfully",
            data: contact,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error submitting form",
            error: error.message,
        });
    }
};