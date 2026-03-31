const Report = require("../model/report.model");
const mongoose = require("mongoose");

exports.createReport = async (req, res) => {
    const {
        recordType,
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
    if (!recordType || !title || !description || !riskLevel || !location) {
        return res.status(400).json({
            message: "Missing required report fields"
        });
    }

    const report = await Report.create({
        recordType,
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

// Get all reports
exports.getReports = async (req, res) => {
    try {
        const reports = await Report.find()
            .populate('reportedBy.userId', 'name email')
            .populate('location.clientId', 'name')
            .populate('location.siteId', 'name')
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            data: reports
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error fetching reports",
            error: error.message
        });
    }
};

// Get single report by ID
exports.getReportById = async (req, res) => {
    try {
        const { id } = req.params;

        const report = await Report.findById(id)
            .populate('reportedBy.userId', 'name email')
            .populate('location.clientId', 'name')
            .populate('location.siteId', 'name');

        if (!report) {
            return res.status(404).json({
                success: false,
                message: "Report not found"
            });
        }

        res.status(200).json({
            success: true,
            data: report
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error fetching report",
            error: error.message
        });
    }
};

// Get all reports submitted by a particular user
exports.getReportsByUser = async (req, res) => {
    try {
        const { userId } = req.params;

        // Convert userId to ObjectId
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid user ID format"
            });
        }

        const reports = await Report.find({ "reportedBy.userId": new mongoose.Types.ObjectId(userId) })
            .populate('reportedBy.userId', 'name email')
            .populate('location.clientId', 'name')
            .populate('location.siteId', 'name')
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            data: reports
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error fetching user reports",
            error: error.message
        });
    }
};