const Notification = require("../model/notification.model");
const User = require("../model/user.model");

exports.resolveActionNotificationType = (actionStatus, reportStatus) => {
    const normalizedActionStatus = String(actionStatus || "")
        .trim()
        .toLowerCase();
    const normalizedReportStatus = String(reportStatus || "")
        .trim()
        .toLowerCase();

    if (
        normalizedActionStatus === "completed"
        || normalizedReportStatus === "completed"
    ) {
        return "action_closed";
    }

    return "action_progress";
};

exports.notifyUsers = async ({ userIds, type, title, description, data }) => {
    const uniqueUserIds = [...new Set(
        userIds
            .filter(Boolean)
            .map(userId => userId.toString())
    )];

    if (uniqueUserIds.length === 0) {
        return;
    }

    try {
        await Notification.insertMany(
            uniqueUserIds.map(user => ({
                user,
                type,
                title,
                description,
                data
            }))
        );
    } catch (error) {
        console.error("Error creating notifications:", error.message);
    }
};

exports.notifyReportCompleted = async ({ report, actorId }) => {
    const reporterId = report.reportedBy && report.reportedBy.userId
        ? report.reportedBy.userId.toString()
        : null;
    const reporter = reporterId
        ? await User.findById(reporterId).select("tenantId")
        : null;

    const recipientIds = [];

    if (reporterId && reporterId !== actorId) {
        recipientIds.push(reporterId);
    }

    if (reporter && reporter.tenantId) {
        const managers = await User.find({
            tenantId: reporter.tenantId,
            role: { $in: ["ADMIN", "SUPERVISOR", "HSE_OFFICER"] }
        }).select("_id");

        managers.forEach(manager => {
            const managerId = manager._id.toString();

            if (managerId !== actorId && !recipientIds.includes(managerId)) {
                recipientIds.push(managerId);
            }
        });
    }

    await exports.notifyUsers({
        userIds: recipientIds,
        type: "action_closed",
        title: `Report completed: ${report.title}`,
        description: `The report "${report.title}" has been marked as completed.`,
        data: {
            reportId: report._id.toString(),
            status: "completed"
        }
    });
};
