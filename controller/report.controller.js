// controller/report.controller.js
const Report = require("../model/report.model");
const ReportAction = require("../model/reportAction.model");
const User = require("../model/user.model");
const mongoose = require("mongoose");
const { notifyUser } = require("../utils/notify");
const { serializeReportAction } = require("../utils/reportActionResponse");
const { parseEventTime, enrichReportEventTime } = require("../utils/eventTime");
const { notifyReportCompleted } = require("../utils/notificationHelpers");
const { extractFileMetadata, getFileUrl, deleteFile } = require("../utils/fileHandler");
const {
    buildReportScopeFilter,
    reportBelongsToTenant,
    clientBelongsToTenant,
    findUserInTenant,
    getTenantUserIds
} = require("../utils/tenantScope");
const { ensureTenantOrganization } = require("../utils/ensureTenantOrganization");
const { normalizeLocationId } = require("../utils/userLocation");
const {
    buildReportNotificationData,
    formatReportForResponse,
    formatReportsForResponse,
    fetchPopulatedReport
} = require("../utils/reportResponse");

// ─── Helpers ──────────────────────────────────────────────────────────────────

const ALLOWED_STATUSES = ["open", "in_progress", "action_required", "completed", "over_due"];

const ROLE_LABELS = {
    ADMIN: "Admin",
    SUPERVISOR: "Supervisor",
    HSE_OFFICER: "HSE Officer",
    FIELD_USER: "Field User"
};

const normalizeCommentsForResponse = (report) => {
    const reportObj = report && typeof report.toObject === "function"
        ? report.toObject()
        : report;

    if (!reportObj) return reportObj;

    const currentComments = Array.isArray(reportObj.comments) ? reportObj.comments : null;
    if (currentComments && currentComments.length > 0) {
        delete reportObj.adminComment;
        return enrichReportEventTime(reportObj);
    }

    const legacyComment = reportObj.adminComment;
    if (legacyComment) {
        reportObj.comments = Array.isArray(legacyComment)
            ? legacyComment
            : [legacyComment];
    } else {
        reportObj.comments = [];
    }

    delete reportObj.adminComment;
    return enrichReportEventTime(reportObj);
};

const actionUserFields = "firstName lastName email role status";

const resolveReportLocation = async (req, locationInput = {}) => {
    const submittingUser = await User.findById(req.user.id).select("location tenantId");
    let clientId = normalizeLocationId(locationInput.clientId);

    if (!clientId) {
        const userClientId = normalizeLocationId(submittingUser?.location);

        if (userClientId) {
            const userClientAllowed = await clientBelongsToTenant(
                userClientId,
                req.user.tenantId
            );

            if (userClientAllowed) {
                clientId = userClientId;
            }
        }
    }

    if (!clientId) {
        const organization = await ensureTenantOrganization(req.user.tenantId);
        clientId = normalizeLocationId(organization?.clientId);
    }

    if (!clientId) {
        return { error: "User organization location is not configured" };
    }

    const clientAllowed = await clientBelongsToTenant(clientId, req.user.tenantId);

    if (!clientAllowed) {
        return { error: "Invalid client for your organization" };
    }

    const resolvedLocation = {
        clientId
    };

    if (locationInput.siteId) {
        resolvedLocation.siteId = locationInput.siteId;
    }

    if (locationInput.specificArea) {
        resolvedLocation.specificArea = String(locationInput.specificArea).trim();
    }

    if (locationInput.latitude !== undefined && locationInput.latitude !== "") {
        resolvedLocation.latitude = Number(locationInput.latitude);
    }

    if (locationInput.longitude !== undefined && locationInput.longitude !== "") {
        resolvedLocation.longitude = Number(locationInput.longitude);
    }

    return { value: resolvedLocation };
};

const attachActionsToReports = async (reports, viewer) => {
    const normalizedReports = reports.map(normalizeCommentsForResponse);
    const reportIds = normalizedReports.map(report => report._id);

    if (reportIds.length === 0) {
        return normalizedReports;
    }

    const actions = await ReportAction.find({
        tenantId: viewer.tenantId,
        report: { $in: reportIds }
    })
        .populate("assignedTo", actionUserFields)
        .populate("createdBy", actionUserFields)
        .sort({ createdAt: -1 });

    const actionsByReport = actions.reduce((groupedActions, action) => {
        const reportId = action.report.toString();

        if (!groupedActions.has(reportId)) {
            groupedActions.set(reportId, []);
        }

        groupedActions.get(reportId).push(
            serializeReportAction(action, viewer)
        );
        return groupedActions;
    }, new Map());

    return normalizedReports.map(report => ({
        ...report,
        actions: actionsByReport.get(report._id.toString()) || []
    }));
};

// ─── CREATE REPORT ────────────────────────────────────────────────────────────

exports.createReport = async (req, res) => {
    let {
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

    // Parse location if it's a JSON string (from form-data)
    if (typeof location === 'string') {
        try {
            location = JSON.parse(location);
        } catch (e) {
            // Clean up uploaded files
            if (req.files && Array.isArray(req.files)) {
                req.files.forEach(file => deleteFile(file.path));
            } else if (req.file) {
                deleteFile(req.file.path);
            }
            return res.status(400).json({
                success: false,
                message: "Invalid location format. Must be valid JSON object"
            });
        }
    }

    // Trim riskLevel to remove accidental spaces
    if (riskLevel && typeof riskLevel === 'string') {
        riskLevel = riskLevel.trim().toLowerCase();
    }

    // ── Validation ──────────────────────────────────────────────────────────
    const missingFields = [];

    if (!recordType) missingFields.push("recordType");
    if (!title) missingFields.push("title");
    if (!description) missingFields.push("description");
    if (!riskLevel) missingFields.push("riskLevel");
    if (!eventDate) missingFields.push("eventDate");
    if (!eventTime) missingFields.push("eventTime");

    if (missingFields.length > 0) {
        if (req.files && Array.isArray(req.files)) {
            req.files.forEach(file => deleteFile(file.path));
        } else if (req.file) {
            deleteFile(req.file.path);
        }
        return res.status(400).json({
            success: false,
            message: `Missing required report fields: ${missingFields.join(", ")}`
        });
    }

    const parsedEventTime = parseEventTime(eventTime);

    if (!parsedEventTime.ok) {
        if (req.files && Array.isArray(req.files)) {
            req.files.forEach(file => deleteFile(file.path));
        } else if (req.file) {
            deleteFile(req.file.path);
        }

        return res.status(400).json({
            success: false,
            message: parsedEventTime.message,
            data: {}
        });
    }

    try {
        const resolvedLocation = await resolveReportLocation(req, location || {});

        if (resolvedLocation.error) {
            if (req.files && Array.isArray(req.files)) {
                req.files.forEach(file => deleteFile(file.path));
            } else if (req.file) {
                deleteFile(req.file.path);
            }

            return res.status(400).json({
                success: false,
                message: resolvedLocation.error
            });
        }

        location = resolvedLocation.value;

        // ── Process attachments ─────────────────────────────────────────────
        let processedAttachments = [];

        if (attachments && Array.isArray(attachments)) {
            processedAttachments = attachments;
        }

        if (req.files && Array.isArray(req.files)) {
            const fileAttachments = req.files.map(file => {
                const meta = extractFileMetadata(file);
                return {
                    type: file.mimetype.includes("image") ? "photo"
                        : file.mimetype.includes("video") ? "video"
                        : file.mimetype.includes("audio") ? "audio"
                        : "document",
                    ...meta,
                    url: getFileUrl(meta.path)
                };
            });
            processedAttachments = [...processedAttachments, ...fileAttachments];
        } else if (req.file) {
            const meta = extractFileMetadata(req.file);
            processedAttachments.push({
                type: req.file.mimetype.includes("image") ? "photo"
                    : req.file.mimetype.includes("video") ? "video"
                    : req.file.mimetype.includes("audio") ? "audio"
                    : "document",
                ...meta,
                url: getFileUrl(meta.path)
            });
        }

        // ── Create report ───────────────────────────────────────────────────
        const report = await Report.create({
            tenantId: req.user.tenantId,
            recordType,
            title,
            description,
            riskLevel,
            location,
            eventDate,
            eventTime: parsedEventTime.value.eventTime,
            eventTimePeriod: parsedEventTime.value.eventTimePeriod,
            eventTime24: parsedEventTime.value.eventTime24,
            peopleAffected,
            injuryDetails,
            equipmentInvolved,
            attachments: processedAttachments,
            deviceMeta,
            reportedBy: {
                userId: req.user.id,
                role: req.user.role
            }
        });

        // ── Notify users (non-blocking) ─────────────────────────────────────
        const user = await User.findById(req.user.id).select("firstName lastName").lean();
        const userName = user ? `${user.firstName} ${user.lastName}` : "A user";

        // Get management users
        const managers = await User.find({
            tenantId: req.user.tenantId,
            role: { $in: ["ADMIN", "SUPERVISOR", "HSE_OFFICER"] }
        }).select("_id");

        // Include the report submitter and managers
        const recipientIds = [
            req.user.id,
            ...managers.map(manager => manager._id.toString())
        ];

        // Remove duplicates
        const uniqueRecipients = [...new Set(recipientIds)];
        const notificationData = buildReportNotificationData(report);

        uniqueRecipients.forEach((userId) => {
            notifyUser({
                userId,
                type: "report_submitted",
                title: `Report Submitted: ${report.title}`,
                description:
                    userId.toString() === req.user.id.toString()
                        ? `Your report "${report.title}" was submitted successfully`
                        : `${userName} submitted a ${recordType} report: "${report.title}"`,
                data: notificationData
            }).catch((err) =>
                console.error("[REPORT] report_submitted push failed:", err.message)
            );
        });

        const populatedReport = await fetchPopulatedReport(report._id);
        const formattedReport = await formatReportForResponse(populatedReport);

        return res.status(201).json({
            success: true,
            message: "Report submitted successfully",
            data: {
                report: formattedReport
            }
        });

    } catch (error) {
        console.error("createReport error:", error);
        if (req.files && Array.isArray(req.files)) {
            req.files.forEach(f => deleteFile(f.path));
        } else if (req.file) {
            deleteFile(req.file.path);
        }
        return res.status(500).json({
            success: false,
            message: "Error creating report",
            error: error.message
        });
    }
};

// ─── GET ALL REPORTS ──────────────────────────────────────────────────────────

exports.getReports = async (req, res) => {
    try {
        const reportFilter = await buildReportScopeFilter({
            tenantId: req.user.tenantId,
            role: req.user.role,
            userId: req.user.id
        });

        const reports = await Report.find(reportFilter)
            .populate("reportedBy.userId", "firstName lastName name email")
            .populate("comments.commentedBy", "firstName lastName email role")
            .populate("adminComment.commentedBy", "firstName lastName email role")
            .populate("location.clientId", "name")
            .populate("location.siteId", "name")
            .sort({ createdAt: -1 });

        const reportsWithActions = await attachActionsToReports(
            reports,
            req.user
        );
        const formattedReports = await formatReportsForResponse(reportsWithActions);

        return res.status(200).json({
            success: true,
            message: "Reports fetched successfully",
            data: formattedReports
        });
    } catch (error) {
        console.error("getReports error:", error);
        return res.status(500).json({
            success: false,
            message: "Error fetching reports",
            error: error.message
        });
    }
};

// ─── GET REPORT BY ID ─────────────────────────────────────────────────────────

exports.getReportById = async (req, res) => {
    try {
        const report = await Report.findById(req.params.id)
            .populate("reportedBy.userId", "firstName lastName name email")
            .populate("comments.commentedBy", "firstName lastName email role")
            .populate("adminComment.commentedBy", "firstName lastName email role")
            .populate("location.clientId", "name")
            .populate("location.siteId", "name");

        if (!report) {
            return res.status(404).json({
                success: false,
                message: "Report not found"
            });
        }

        // ── Validate tenant access ──────────────────────────────────────────
        const hasTenantAccess = await reportBelongsToTenant(report, req.user.tenantId);
        if (!hasTenantAccess) {
            return res.status(404).json({
                success: false,
                message: "Report not found"
            });
        }

        // ── Validate field user access ──────────────────────────────────────
        if (
            req.user
            && req.user.role === "FIELD_USER"
            && report.reportedBy
            && report.reportedBy.userId
        ) {
            const reportOwnerId = report.reportedBy.userId._id
                ? report.reportedBy.userId._id.toString()
                : report.reportedBy.userId.toString();

            const canAccessReport = reportOwnerId === req.user.id
                || await ReportAction.exists({
                    tenantId: req.user.tenantId,
                    report: report._id,
                    assignedTo: req.user.id
                });

            if (!canAccessReport) {
                return res.status(403).json({
                    success: false,
                    message: "Access denied"
                });
            }
        }

        const [reportWithActions] = await attachActionsToReports(
            [report],
            req.user
        );
        const [formattedReport] = await formatReportsForResponse([reportWithActions]);

        return res.status(200).json({
            success: true,
            message: "Report fetched successfully",
            data: formattedReport
        });
    } catch (error) {
        console.error("getReportById error:", error);
        return res.status(500).json({
            success: false,
            message: "Error fetching report",
            error: error.message
        });
    }
};

// ─── GET REPORTS BY USER ──────────────────────────────────────────────────────

exports.getReportsByUser = async (req, res) => {
    try {
        const { userId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid user ID format"
            });
        }

        // Field users can only access their own reports
        if (req.user && req.user.role === "FIELD_USER" && userId !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: "Access denied"
            });
        }

        // ── Validate user belongs to tenant ─────────────────────────────────
        const tenantUser = await findUserInTenant(userId, req.user.tenantId);
        if (!tenantUser) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        const reports = await Report.find({
            "reportedBy.userId": new mongoose.Types.ObjectId(userId)
        }).populate("reportedBy.userId", "firstName lastName email role")
            .populate("comments.commentedBy", "firstName lastName email role")
            .populate("adminComment.commentedBy", "firstName lastName email role")
            .populate("location.clientId", "name")
            .populate("location.siteId", "name")
            .sort({ createdAt: -1 });

        const reportsWithActions = await attachActionsToReports(
            reports,
            req.user
        );
        const formattedReports = await formatReportsForResponse(reportsWithActions);

        return res.status(200).json({
            success: true,
            message: "User reports fetched successfully",
            data: formattedReports,
        });
    } catch (error) {
        console.error("getReportsByUser error:", error);
        return res.status(500).json({
            success: false,
            message: "Error fetching user reports",
            error: error.message
        });
    }
};

// ─── GET MY REPORTS ───────────────────────────────────────────────────────────

exports.getMyReports = async (req, res) => {
    try {
        const userId = new mongoose.Types.ObjectId(req.user.id);

        const reports = await Report.find({ "reportedBy.userId": userId })
            .populate("reportedBy.userId", "firstName lastName email")
            .populate("comments.commentedBy", "firstName lastName email role")
            .populate("location.clientId", "name")
            .populate("location.siteId", "name")
            .sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            count: reports.length,
            data: reports.map(normalizeCommentsForResponse)
        });
    } catch (error) {
        console.error("getMyReports error:", error);
        return res.status(500).json({
            success: false,
            message: "Error fetching your reports",
            error: error.message
        });
    }
};

// ─── ADD COMMENT ──────────────────────────────────────────────────────────────

exports.addReportComment = async (req, res) => {
    try {
        const { id } = req.params;
        const { comment } = req.body;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ success: false, message: "Invalid report ID format" });
        }

        if (!comment || !comment.trim()) {
            return res.status(400).json({ success: false, message: "Comment is required" });
        }

        const report = await Report.findById(id);
        if (!report) {
            return res.status(404).json({ success: false, message: "Report not found" });
        }

        // ── Validate tenant access ──────────────────────────────────────────
        if (!(await reportBelongsToTenant(report, req.user.tenantId))) {
            return res.status(404).json({
                success: false,
                message: "Report not found"
            });
        }

        const trimmedComment = comment.trim();
        const commentEntry = {
            text: trimmedComment,
            commentedBy: req.user.id,
            commentedAt: new Date()
        };

        // Migrate legacy comments
        if (!Array.isArray(report.comments)) {
            const legacy = report.adminComment;
            report.comments = legacy
                ? (Array.isArray(legacy) ? legacy : [legacy])
                : [];
        }

        report.comments = report.comments.filter(
            c => c && c.text && c.commentedBy && c.commentedAt
        );

        report.comments.push(commentEntry);

        if (["ADMIN", "SUPERVISOR"].includes(req.user.role) && report.status === "open") {
            report.status = "in_progress";
        }

        await report.save();

        // ── Notify reporter ─────────────────────────────────────────────────
        const commenter = await User.findById(req.user.id)
            .select("firstName lastName role")
            .lean();

        const commenterName = commenter
            ? `${commenter.firstName} ${commenter.lastName}`
            : "A user";

        const commenterRole = commenter?.role
            ? ROLE_LABELS[commenter.role] || commenter.role
            : "User";

        const reporterId = report.reportedBy?.userId?.toString();
        const notifyRoles = ["ADMIN", "SUPERVISOR", "HSE_OFFICER"];

        if (
            notifyRoles.includes(commenter?.role)
            && reporterId
            && reporterId !== req.user.id
        ) {
            notifyUser({
                userId: reporterId,
                type: "report_commented",
                title: `New Comment: ${report.title}`,
                description: `${commenterName} (${commenterRole}) commented on your report: "${report.title}"`,
                data: {
                    reportId: report._id.toString(),
                    comment: trimmedComment
                }
            }).catch((err) =>
                console.error("[REPORT] report_commented push failed:", err.message)
            );
        }

        const populatedReport = await fetchPopulatedReport(report._id);
        const formattedReport = await formatReportForResponse(populatedReport);
        const savedComment = formattedReport.comments[formattedReport.comments.length - 1];

        return res.status(200).json({
            success: true,
            message: "Comment added to report",
            data: {
                reportId: report._id,
                comment: savedComment,
                report: formattedReport
            }
        });
    } catch (error) {
        console.error("addReportComment error:", error);
        return res.status(500).json({
            success: false,
            message: "Error adding report comment",
            error: error.message
        });
    }
};

// ─── DELETE COMMENT ───────────────────────────────────────────────────────────

exports.deleteReportComment = async (req, res) => {
    try {
        const { id, commentId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ success: false, message: "Invalid report ID format" });
        }

        if (!mongoose.Types.ObjectId.isValid(commentId)) {
            return res.status(400).json({ success: false, message: "Invalid comment ID format" });
        }

        const report = await Report.findById(id);
        if (!report) {
            return res.status(404).json({ success: false, message: "Report not found" });
        }

        // ── Validate tenant access ──────────────────────────────────────────
        if (!(await reportBelongsToTenant(report, req.user.tenantId))) {
            return res.status(404).json({
                success: false,
                message: "Report not found"
            });
        }

        // Migrate legacy comments if needed
        if (!Array.isArray(report.comments)) {
            const legacyComment = report.adminComment && report.adminComment.text
                ? (typeof report.adminComment.toObject === "function"
                    ? report.adminComment.toObject()
                    : report.adminComment)
                : null;
            report.comments = Array.isArray(report.adminComment)
                ? report.adminComment
                : (legacyComment ? [legacyComment] : []);
        }

        if (!Array.isArray(report.comments) || report.comments.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No comments found for this report"
            });
        }

        const commentDoc = report.comments.id(commentId);
        if (!commentDoc) {
            return res.status(404).json({ success: false, message: "Comment not found" });
        }

        commentDoc.deleteOne();
        await report.save();

        return res.status(200).json({
            success: true,
            message: "Comment deleted",
            data: { reportId: report._id, commentId }
        });
    } catch (error) {
        console.error("deleteReportComment error:", error);
        return res.status(500).json({
            success: false,
            message: "Error deleting report comment",
            error: error.message
        });
    }
};

// ─── UPDATE STATUS ────────────────────────────────────────────────────────────

exports.updateReportStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const normalizedStatus = String(req.body.status || "")
            .trim()
            .toLowerCase();

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ success: false, message: "Invalid report ID format" });
        }

        if (!normalizedStatus) {
            return res.status(400).json({ success: false, message: "Status is required" });
        }

        if (!ALLOWED_STATUSES.includes(normalizedStatus)) {
            return res.status(400).json({
                success: false,
                message: `Invalid status. Must be one of: ${ALLOWED_STATUSES.join(", ")}`
            });
        }

        const report = await Report.findById(id);
        if (!report) {
            return res.status(404).json({ success: false, message: "Report not found" });
        }

        // ── Validate tenant access ──────────────────────────────────────────
        if (!(await reportBelongsToTenant(report, req.user.tenantId))) {
            return res.status(404).json({
                success: false,
                message: "Report not found"
            });
        }

        // Prevent setting same status
        if (report.status === normalizedStatus) {
            return res.status(400).json({
                success: false,
                message: `Report is already in "${normalizedStatus}" status`
            });
        }

        const previousStatus = report.status;
        report.status = normalizedStatus;
        await report.save();

        if (normalizedStatus === "completed" && previousStatus !== "completed") {
            await notifyReportCompleted({
                report,
                actorId: req.user.id
            });
        } else {
            const reporterId = report.reportedBy?.userId?.toString();
            if (reporterId && reporterId !== req.user.id) {
                notifyUser({
                    userId: reporterId,
                    type: "action_progress",
                    title: `Report Status Updated: ${report.title}`,
                    description: `Your report "${report.title}" status changed from "${previousStatus}" to "${normalizedStatus}"`,
                    data: {
                        reportId: report._id.toString(),
                        previousStatus,
                        newStatus: normalizedStatus,
                    }
                }).catch((err) =>
                    console.error("[REPORT] status update push failed:", err.message)
                );
            }
        }

        const populatedReport = await fetchPopulatedReport(report._id);
        const formattedReport = await formatReportForResponse(populatedReport);

        return res.status(200).json({
            success: true,
            message: "Report status updated",
            data: {
                report: formattedReport,
                previousStatus
            }
        });
    } catch (error) {
        console.error("updateReportStatus error:", error);
        return res.status(500).json({
            success: false,
            message: "Error updating report status",
            error: error.message
        });
    }
};

// ─── SUMMARIES ────────────────────────────────────────────────────────────────

exports.getReportsSummary = async (req, res) => {
    try {
        const scopeFilter = await buildReportScopeFilter({
            tenantId: req.user.tenantId,
            role: req.user.role,
            userId: req.user.id
        });

        const [
            total_reports,
            open_reports,
            high_risk_reports,
            actions,
            actions_completed,
            in_progress
        ] = await Promise.all([
            Report.countDocuments(scopeFilter),
            Report.countDocuments({ ...scopeFilter, status: "open" }),
            Report.countDocuments({ ...scopeFilter, riskLevel: { $in: ["high", "critical"] } }),
            Report.countDocuments({ ...scopeFilter, status: "action_required" }),
            Report.countDocuments({ ...scopeFilter, status: "completed" }),
            Report.countDocuments({ ...scopeFilter, status: "in_progress" })
        ]);

        return res.status(200).json({
            success: true,
            data: {
                total_reports,
                open_reports,
                high_risk_reports,
                actions,
                actions_completed,
                closed_reports: actions_completed,
                in_progress
            }
        });
    } catch (error) {
        console.error("getReportsSummary error:", error);
        return res.status(500).json({
            success: false,
            message: "Error fetching reports summary",
            error: error.message
        });
    }
};

exports.getMyReportsSummary = async (req, res) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.user.id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid user ID in token"
            });
        }

        const userId = new mongoose.Types.ObjectId(req.user.id);

        const [
            total_reports,
            open_reports,
            high_risk_reports,
            action_required,
            completed,
            in_progress
        ] = await Promise.all([
            Report.countDocuments({ "reportedBy.userId": userId }),
            Report.countDocuments({ "reportedBy.userId": userId, status: "open" }),
            Report.countDocuments({ "reportedBy.userId": userId, riskLevel: { $in: ["high", "critical"] } }),
            Report.countDocuments({ "reportedBy.userId": userId, status: "action_required" }),
            Report.countDocuments({ "reportedBy.userId": userId, status: "completed" }),
            Report.countDocuments({ "reportedBy.userId": userId, status: "in_progress" })
        ]);

        const user = await User.findById(userId)
            .select("firstName lastName email role")
            .lean();

        return res.status(200).json({
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
        console.error("getMyReportsSummary error:", error);
        return res.status(500).json({
            success: false,
            message: "Error fetching your reports summary",
            error: error.message
        });
    }
};

exports.getReportsSummaryByEachUser = async (req, res) => {
    try {
        const tenantUserIds = await getTenantUserIds(req.user.tenantId);

        if (tenantUserIds.length === 0) {
            return res.status(200).json({
                success: true,
                data: []
            });
        }

        const grouped = await Report.aggregate([
            {
                $match: {
                    "reportedBy.userId": { $in: tenantUserIds }
                }
            },
            {
                $group: {
                    _id: "$reportedBy.userId",
                    total_reports: { $sum: 1 },
                    open_reports: { $sum: { $cond: [{ $eq: ["$status", "open"] }, 1, 0] } },
                    high_risk_reports: { $sum: { $cond: [{ $in: ["$riskLevel", ["high", "critical"]] }, 1, 0] } },
                    action_required: { $sum: { $cond: [{ $eq: ["$status", "action_required"] }, 1, 0] } },
                    completed: { $sum: { $cond: [{ $eq: ["$status", "completed"] }, 1, 0] } },
                    in_progress: { $sum: { $cond: [{ $eq: ["$status", "in_progress"] }, 1, 0] } }
                }
            },
            { $sort: { total_reports: -1 } }
        ]);

        const summaryWithUsers = await Promise.all(
            grouped.map(async (s) => {
                const user = await User.findById(s._id)
                    .select("firstName lastName email role")
                    .lean();
                return {
                    userId: s._id,
                    user: user ? {
                        name: `${user.firstName} ${user.lastName}`,
                        email: user.email,
                        role: user.role
                    } : null,
                    summary: {
                        total_reports: s.total_reports,
                        open_reports: s.open_reports,
                        high_risk_reports: s.high_risk_reports,
                        action_required: s.action_required,
                        completed: s.completed,
                        in_progress: s.in_progress
                    }
                };
            })
        );

        return res.status(200).json({
            success: true,
            data: summaryWithUsers
        });
    } catch (error) {
        console.error("getReportsSummaryByEachUser error:", error);
        return res.status(500).json({
            success: false,
            message: "Error fetching reports summary by user",
            error: error.message
        });
    }
};