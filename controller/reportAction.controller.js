// controller/reportAction.controller.js
const mongoose = require("mongoose");
const Report = require("../model/report.model");
const ReportAction = require("../model/reportAction.model");
const User = require("../model/user.model");
const Notification = require("../model/notification.model");
const { notifyUser, notifyMany } = require("../utils/notify");
const {
    MANAGEMENT_ROLES,
    serializeReportAction
} = require("../utils/reportActionResponse");
const {
    resolveActionNotificationType,
    notifyUsers
} = require("../utils/notificationHelpers");

// ─── Constants ────────────────────────────────────────────────────────────────

const ACTION_STATUSES = ["open", "in_progress", "completed", "over_due"];
const ACTION_PRIORITIES = ["Low", "Medium", "High", "Critical"];

const STATUS_LABELS = {
    open: "Open",
    in_progress: "In Progress",
    completed: "Completed",
    over_due: "Over Due",
};

const actionPopulate = [
    {
        path: "report",
        select: "recordType title description riskLevel location eventDate eventTime eventTimePeriod eventTime24 status reportedBy attachments",
        populate: [
            { path: "reportedBy.userId", select: "firstName lastName email role status" },
            { path: "location.clientId", select: "name" },
            { path: "location.siteId", select: "name" }
        ]
    },
    { path: "assignedTo", select: "firstName lastName email role status" },
    { path: "createdBy", select: "firstName lastName email role status" }
];

// ─── Private Helpers ──────────────────────────────────────────────────────────

const findTenantReport = async (reportId, tenantId) => {
    const report = await Report.findById(reportId);
    if (!report || !report.reportedBy || !report.reportedBy.userId) {
        return null;
    }

    const { reportBelongsToTenant } = require("../utils/tenantScope");
    const belongsToTenant = await reportBelongsToTenant(report, tenantId);

    return belongsToTenant ? report : null;
};

const resolveAssignedUser = async (assignedTo, tenantId) => {
    if (assignedTo == null) return null;

    const identifier = String(assignedTo).trim();
    if (!identifier) return null;

    const identityFilter = mongoose.Types.ObjectId.isValid(identifier)
        ? { _id: identifier }
        : { email: identifier };

    return User.findOne({ ...identityFilter, tenantId, status: "ACTIVE" });
};

const populateAction = (action) =>
    ReportAction.populate(action, actionPopulate);

const syncReportStatus = async (reportId) => {
    const actions = await ReportAction.find({ report: reportId }).select("status");
    if (!actions.length) return;

    let status = "action_required";

    if (actions.every((a) => a.status === "completed")) {
        status = "completed";
    } else if (actions.some((a) => a.status === "over_due")) {
        status = "over_due";
    } else if (actions.some((a) => a.status === "in_progress")) {
        status = "in_progress";
    }

    await Report.findByIdAndUpdate(reportId, { status });
};

const canManageAction = (action, user) =>
    MANAGEMENT_ROLES.includes(user.role) ||
    action.assignedTo.toString() === user.id;

/**
 * Deduplicate userIds and exclude the acting user
 * so we never notify the person who just performed the action.
 */
const resolveTargets = (userIds, excludeId) =>
    [...new Set(
        userIds
            .filter(Boolean)
            .map((id) => id.toString())
            .filter((id) => id !== excludeId?.toString())
    )];

// ─── CREATE ACTION ────────────────────────────────────────────────────────────

exports.createReportAction = async (req, res) => {
    try {
        const { reportId } = req.params;
        const {
            actionTitle,
            assignedTo,
            dueDate,
            priority = "Medium",
            description
        } = req.body;

        // ── Validation ──────────────────────────────────────────────────────
        if (!mongoose.Types.ObjectId.isValid(reportId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid report ID format"
            });
        }

        if (!actionTitle || !String(actionTitle).trim()) {
            return res.status(400).json({
                success: false,
                message: "Action title is required"
            });
        }

        if (!ACTION_PRIORITIES.includes(priority)) {
            return res.status(400).json({
                success: false,
                message: `Invalid priority. Must be one of: ${ACTION_PRIORITIES.join(", ")}`
            });
        }

        const parsedDueDate = dueDate ? new Date(dueDate) : undefined;
        if (parsedDueDate && isNaN(parsedDueDate.getTime())) {
            return res.status(400).json({
                success: false,
                message: "Invalid due date"
            });
        }

        // ── Resolve report + assigned user ──────────────────────────────────
        const [report, assignedUser] = await Promise.all([
            findTenantReport(reportId, req.user.tenantId),
            resolveAssignedUser(assignedTo, req.user.tenantId)
        ]);

        if (!report) {
            return res.status(404).json({
                success: false,
                message: "Report not found"
            });
        }

        if (!assignedUser) {
            return res.status(400).json({
                success: false,
                message: "Assigned user was not found or is not active"
            });
        }

        // ── Create action ───────────────────────────────────────────────────
        const action = await ReportAction.create({
            tenantId: req.user.tenantId,
            report: report._id,
            actionTitle: String(actionTitle).trim(),
            assignedTo: assignedUser._id,
            dueDate: parsedDueDate,
            priority,
            description,
            createdBy: req.user.id
        });

        // ── Sync report status — rollback if sync fails ─────────────────────
        try {
            await syncReportStatus(report._id);
        } catch (syncErr) {
            await ReportAction.deleteOne({ _id: action._id });
            throw syncErr;
        }

        // ── Notify assigned user (DB + Push) ────────────────────────────────
        await notifyUsers({
            userIds: [assignedUser._id],
            type: "action_assigned",
            title: `Action Assigned: ${action.actionTitle}`,
            description: `You have been assigned an action from report "${report.title}"${description ? `: ${description}` : "."}`,
            data: {
                reportId: report._id.toString(),
                actionId: action._id.toString(),
                priority: action.priority,
                dueDate: action.dueDate?.toISOString() ?? null,
                createdBy: req.user.id,
            }
        });

        const populatedAction = await populateAction(action);

        return res.status(201).json({
            success: true,
            message: "Action created for report",
            data: {
                reportId: report._id,
                action: serializeReportAction(populatedAction, req.user)
            }
        });

    } catch (error) {
        console.error("createReportAction error:", error);
        return res.status(500).json({
            success: false,
            message: "Error creating report action",
            error: error.message
        });
    }
};

// ─── GET MY ACTIONS ───────────────────────────────────────────────────────────

exports.getMyActions = async (req, res) => {
    try {
        const filter = {
            tenantId: req.user.tenantId,
            assignedTo: req.user.id
        };

        if (req.query.status) {
            if (!ACTION_STATUSES.includes(req.query.status)) {
                return res.status(400).json({
                    success: false,
                    message: `Invalid status. Must be one of: ${ACTION_STATUSES.join(", ")}`
                });
            }
            filter.status = req.query.status;
        }

        const actions = await ReportAction.find(filter)
            .populate(actionPopulate)
            .sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            data: actions.map((action) =>
                serializeReportAction(action, req.user)
            )
        });

    } catch (error) {
        console.error("getMyActions error:", error);
        return res.status(500).json({
            success: false,
            message: "Error fetching assigned actions",
            error: error.message
        });
    }
};

// ─── GET REPORT ACTIONS ───────────────────────────────────────────────────────

exports.getReportActions = async (req, res) => {
    try {
        const { reportId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(reportId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid report ID format"
            });
        }

        const report = await findTenantReport(reportId, req.user.tenantId);
        if (!report) {
            return res.status(404).json({
                success: false,
                message: "Report not found"
            });
        }

        const isOwner = report.reportedBy.userId.toString() === req.user.id;
        const hasAssignedAction = await ReportAction.exists({
            tenantId: req.user.tenantId,
            report: report._id,
            assignedTo: req.user.id
        });

        if (
            !MANAGEMENT_ROLES.includes(req.user.role) &&
            !isOwner &&
            !hasAssignedAction
        ) {
            return res.status(403).json({
                success: false,
                message: "Access denied"
            });
        }

        const actions = await ReportAction.find({
            tenantId: req.user.tenantId,
            report: report._id
        })
            .populate(actionPopulate)
            .sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            data: actions.map((action) =>
                serializeReportAction(action, req.user)
            )
        });

    } catch (error) {
        console.error("getReportActions error:", error);
        return res.status(500).json({
            success: false,
            message: "Error fetching report actions",
            error: error.message
        });
    }
};

// ─── GET ACTION BY ID ─────────────────────────────────────────────────────────

exports.getActionById = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid action ID format"
            });
        }

        const action = await ReportAction.findOne({
            _id: id,
            tenantId: req.user.tenantId
        });

        if (!action) {
            return res.status(404).json({
                success: false,
                message: "Action not found"
            });
        }

        if (!canManageAction(action, req.user)) {
            return res.status(403).json({
                success: false,
                message: "Access denied"
            });
        }

        const populatedAction = await populateAction(action);

        return res.status(200).json({
            success: true,
            data: serializeReportAction(populatedAction, req.user)
        });

    } catch (error) {
        console.error("getActionById error:", error);
        return res.status(500).json({
            success: false,
            message: "Error fetching action",
            error: error.message
        });
    }
};

// ─── UPDATE ACTION STATUS ─────────────────────────────────────────────────────

exports.updateActionStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const normalizedStatus = String(req.body.status || "")
            .trim()
            .toLowerCase();

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid action ID format"
            });
        }

        if (!ACTION_STATUSES.includes(normalizedStatus)) {
            return res.status(400).json({
                success: false,
                message: `Invalid status. Must be one of: ${ACTION_STATUSES.join(", ")}`
            });
        }

        const action = await ReportAction.findOne({
            _id: id,
            tenantId: req.user.tenantId
        });

        if (!action) {
            return res.status(404).json({
                success: false,
                message: "Action not found"
            });
        }

        if (!canManageAction(action, req.user)) {
            return res.status(403).json({
                success: false,
                message: "Only the assignee or management can update this action"
            });
        }

        // Prevent redundant update
        if (action.status === normalizedStatus) {
            return res.status(400).json({
                success: false,
                message: `Action is already in "${STATUS_LABELS[normalizedStatus]}" status`
            });
        }

        const previousStatus = action.status;
        action.status = normalizedStatus;
        action.completedAt = normalizedStatus === "completed" ? new Date() : null;
        await action.save();

        await syncReportStatus(action.report);

        // ── Fetch report for notification context ───────────────────────────
        const report = await Report.findById(action.report)
            .select("title reportedBy status")
            .lean();

        const reportTitle = report?.title ?? "Report";
        const statusLabel = STATUS_LABELS[normalizedStatus] ?? normalizedStatus;
        const prevLabel = STATUS_LABELS[previousStatus] ?? previousStatus;

        const notificationType = resolveActionNotificationType(
            normalizedStatus,
            report?.status
        );

        // Notify creator + report owner — exclude the person who just acted
        const targetIds = resolveTargets(
            [action.createdBy, report?.reportedBy?.userId],
            req.user.id
        );

        if (targetIds.length) {
            await notifyUsers({
                userIds: targetIds,
                type: notificationType,
                title: notificationType === "action_closed"
                    ? `Action Completed: ${action.actionTitle}`
                    : `Action ${statusLabel}: ${action.actionTitle}`,
                description: notificationType === "action_closed"
                    ? `The action "${action.actionTitle}" for report "${reportTitle}" has been completed.`
                    : `The action "${action.actionTitle}" for report "${reportTitle}" changed from ${prevLabel} to ${statusLabel}.`,
                data: {
                    reportId: action.report.toString(),
                    actionId: action._id.toString(),
                    previousStatus,
                    newStatus: normalizedStatus,
                    reportStatus: report?.status ?? null
                }
            });
        }

        const populatedAction = await populateAction(action);

        return res.status(200).json({
            success: true,
            message: `Action status updated to ${statusLabel}`,
            data: serializeReportAction(populatedAction, req.user)
        });

    } catch (error) {
        console.error("updateActionStatus error:", error);
        return res.status(500).json({
            success: false,
            message: "Error updating action status",
            error: error.message
        });
    }
};

// ─── REASSIGN ACTION ──────────────────────────────────────────────────────────

exports.reassignAction = async (req, res) => {
    try {
        const { id } = req.params;
        const { assignedTo } = req.body;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid action ID format"
            });
        }

        const [action, assignedUser] = await Promise.all([
            ReportAction.findOne({ _id: id, tenantId: req.user.tenantId }),
            resolveAssignedUser(assignedTo, req.user.tenantId)
        ]);

        if (!action) {
            return res.status(404).json({
                success: false,
                message: "Action not found"
            });
        }

        if (!assignedUser) {
            return res.status(400).json({
                success: false,
                message: "Assigned user was not found or is not active"
            });
        }

        const previousAssigneeId = action.assignedTo?.toString();
        const isReassignment =
            previousAssigneeId &&
            previousAssigneeId !== assignedUser._id.toString();

        action.assignedTo = assignedUser._id;
        await action.save();

        const report = await Report.findById(action.report)
            .select("title")
            .lean();

        const reportTitle = report?.title ?? "Report";

        // ── Notify new assignee ─────────────────────────────────────────────
        await notifyUsers({
            userIds: [assignedUser._id],
            type: "action_assigned",
            title: isReassignment
                ? `Action Reassigned: ${action.actionTitle}`
                : `Action Assigned: ${action.actionTitle}`,
            description: isReassignment
                ? `You have been reassigned the action "${action.actionTitle}" from report "${reportTitle}".`
                : `You have been assigned the action "${action.actionTitle}" from report "${reportTitle}".`,
            data: {
                reportId: action.report.toString(),
                actionId: action._id.toString(),
                priority: action.priority,
                dueDate: action.dueDate?.toISOString() ?? null,
                assignedBy: req.user.id
            }
        });

        // ── Notify previous assignee if this is a true reassignment ─────────
        if (isReassignment && previousAssigneeId !== req.user.id) {
            await notifyUsers({
                userIds: [previousAssigneeId],
                type: "action_unassigned",
                title: `Action Unassigned: ${action.actionTitle}`,
                description: `You have been unassigned from "${action.actionTitle}" in report "${reportTitle}". It has been reassigned to someone else.`,
                data: {
                    reportId: action.report.toString(),
                    actionId: action._id.toString(),
                }
            });
        }

        const populatedAction = await populateAction(action);

        return res.status(200).json({
            success: true,
            message: isReassignment
                ? "Action reassigned successfully"
                : "Action assigned successfully",
            data: serializeReportAction(populatedAction, req.user)
        });

    } catch (error) {
        console.error("reassignAction error:", error);
        return res.status(500).json({
            success: false,
            message: "Error reassigning action",
            error: error.message
        });
    }
};