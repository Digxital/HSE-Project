const Report = require("../model/report.model");

exports.createReport = async (req, res) => {
    const {
        recordCategory,
        title,
        description,
        riskLevel,
        location,
        eventDate,
        eventTime,
        peopleAffected,
        injuryDetails,
        equipmentInvolved,
        attachments,
        deviceMeta
    } = req.body;

    // Basic validation
    if (!recordCategory || !title || !description || !riskLevel || !location) {
        return res.status(400).json({
            message: "Missing required report fields"
        });
    }

    const report = await Report.create({
        recordCategory,
        title,
        description,
        riskLevel,
        location,
        eventDate,
        eventTime,
        peopleAffected,
        injuryDetails,
        equipmentInvolved,
        attachments,
        deviceMeta,

        // from token
        reportedBy: {
            userId: req.user.id,
            role: req.user.role
        }
    });

    res.status(201).json({
        message: "Report submitted successfully",
        reportId: report._id
    });
};
