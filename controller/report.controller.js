const Report = require("../model/report.model");
const User = require("../model/user.model");
const Notification = require("../model/notification.model");
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

    // Fetch user details to get the full name
    const user = await User.findById(req.user.id);

    // Create notification
    if (user) {
        const userName = `${user.firstName} ${user.lastName}`;
        await Notification.create({
            user: req.user.id,
            type: "report_submitted",
            title: "New Report Submitted",
            description: `A new report has been submitted by ${userName} and is awaiting review.`,
            data: {
                reportId: report._id,
                recordType: report.recordType,
                riskLevel: report.riskLevel
            }
        });
    }

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

// Get reports summary/dashboard
exports.getReportsSummary = async (req, res) => {
    try {
        // Count total reports
        const total_reports = await Report.countDocuments();

        // Count open reports
        const open_reports = await Report.countDocuments({ status: "open" });

        // Count high_risk reports (high or critical)
        const high_risk_reports = await Report.countDocuments({ 
            riskLevel: { $in: ["high", "critical"] } 
        });

        // Count action_required reports
        const actions = await Report.countDocuments({ status: "action_required" });

        // Count completed reports
        const actions_completed = await Report.countDocuments({ status: "completed" });

        // Count closed reports (same as completed)
        const closed_reports = await Report.countDocuments({ status: "completed" });

        // Count in_progress reports
        const in_progress = await Report.countDocuments({ status: "in_progress" });

        res.status(200).json({
            success: true,
            data: {
                total_reports,
                open_reports,
                high_risk_reports,
                actions,
                actions_completed,
                closed_reports,
                in_progress
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error fetching reports summary",
            error: error.message
        });
    }
};

exports.getReportsSummaryByEachUser = async (req, res) => {
    try {
        // Aggregate reports by userId
        const reportsGroupedByUser = await Report.aggregate([
            {
                $group: {
                    _id: "$reportedBy.userId",
                    total_reports: { $sum: 1 },
                    open_reports: {
                        $sum: { $cond: [{ $eq: ["$status", "open"] }, 1, 0] }
                    },
                    high_risk_reports: {
                        $sum: {
                            $cond: [
                                { $in: ["$riskLevel", ["high", "critical"]] },
                                1,
                                0
                            ]
                        }
                    },
                    action_required: {
                        $sum: { $cond: [{ $eq: ["$status", "action_required"] }, 1, 0] }
                    },
                    completed: {
                        $sum: { $cond: [{ $eq: ["$status", "completed"] }, 1, 0] }
                    },
                    in_progress: {
                        $sum: { $cond: [{ $eq: ["$status", "in_progress"] }, 1, 0] }
                    }
                }
            },
            {
                $sort: { total_reports: -1 }
            }
        ]);

        // Fetch user details for each group
        const summaryWithUserDetails = await Promise.all(
            reportsGroupedByUser.map(async (summary) => {
                const user = await User.findById(summary._id).select(
                    "firstName lastName email role"
                );
                return {
                    userId: summary._id,
                    user: user ? {
                        name: `${user.firstName} ${user.lastName}`,
                        email: user.email,
                        role: user.role
                    } : null,
                    summary: {
                        total_reports: summary.total_reports,
                        open_reports: summary.open_reports,
                        high_risk_reports: summary.high_risk_reports,
                        action_required: summary.action_required,
                        completed: summary.completed,
                        in_progress: summary.in_progress
                    }
                };
            })
        );

        res.status(200).json({
            success: true,
            data: summaryWithUserDetails
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error fetching reports summary by user",
            error: error.message
        });
    }
};

exports.getMyReportsSummary = async (req, res) => {
    try {
        const userId = req.user.id;

        // Count reports for the current user
        const total_reports = await Report.countDocuments({
            "reportedBy.userId": userId
        });

        // Count open reports
        const open_reports = await Report.countDocuments({
            "reportedBy.userId": userId,
            status: "open"
        });

        // Count high_risk reports (high or critical)
        const high_risk_reports = await Report.countDocuments({
            "reportedBy.userId": userId,
            riskLevel: { $in: ["high", "critical"] }
        });

        // Count action_required reports
        const action_required = await Report.countDocuments({
            "reportedBy.userId": userId,
            status: "action_required"
        });

        // Count completed reports
        const completed = await Report.countDocuments({
            "reportedBy.userId": userId,
            status: "completed"
        });

        // Count in_progress reports
        const in_progress = await Report.countDocuments({
            "reportedBy.userId": userId,
            status: "in_progress"
        });

        // Fetch user details
        const user = await User.findById(userId).select(
            "firstName lastName email role"
        );

        res.status(200).json({
            success: true,
            data: {
                user: user ? {
                    name: `${user.firstName} ${user.lastName}`,
                    email: user.email,
                    role: user.role
                } : null,
                summary: {
                    total_reports,
                    open_reports,
                    high_risk_reports,
                    action_required,
                    completed,
                    in_progress
                }
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error fetching your reports summary",
            error: error.message
        });
    }
};
