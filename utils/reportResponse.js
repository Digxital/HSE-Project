const Report = require("../model/report.model");
const { enrichReportEventTime } = require("./eventTime");
const {
    ensureTenantOrganization,
    formatOrganizationResponse
} = require("./ensureTenantOrganization");

const formatReportLocation = (location) => {
    if (!location) {
        return null;
    }

    const loc = location.toObject ? location.toObject() : location;
    const client = loc.clientId && typeof loc.clientId === "object" ? loc.clientId : null;
    const site = loc.siteId && typeof loc.siteId === "object" ? loc.siteId : null;

    return {
        clientId: client?._id?.toString() || loc.clientId?.toString() || null,
        client: client
            ? {
                id: client._id.toString(),
                name: client.name,
                description: client.description || null
            }
            : null,
        siteId: site?._id?.toString() || loc.siteId?.toString() || null,
        site: site
            ? {
                id: site._id.toString(),
                name: site.name
            }
            : null,
        specificArea: loc.specificArea || null,
        latitude: loc.latitude ?? null,
        longitude: loc.longitude ?? null
    };
};

const formatReporter = (reportedBy) => {
    if (!reportedBy) {
        return null;
    }

    const userRef = reportedBy.userId;
    const user = userRef && typeof userRef === "object" ? userRef : null;

    return {
        userId: user?._id?.toString() || userRef?.toString() || null,
        role: reportedBy.role,
        user: user
            ? {
                id: user._id.toString(),
                firstName: user.firstName,
                lastName: user.lastName,
                fullName: `${user.firstName} ${user.lastName}`,
                email: user.email,
                name: user.name || null
            }
            : null
    };
};

const formatComments = (comments) => {
    if (!Array.isArray(comments)) {
        return [];
    }

    return comments.map((entry) => {
        const comment = entry.toObject ? entry.toObject() : entry;
        const commenterRef = comment.commentedBy;
        const commenter = commenterRef && typeof commenterRef === "object"
            ? commenterRef
            : null;

        return {
            id: comment._id?.toString(),
            text: comment.text,
            commentedAt: comment.commentedAt,
            commentedBy: commenter
                ? {
                    id: commenter._id.toString(),
                    firstName: commenter.firstName,
                    lastName: commenter.lastName,
                    fullName: `${commenter.firstName} ${commenter.lastName}`,
                    email: commenter.email,
                    role: commenter.role
                }
                : (commenterRef?.toString() || null)
        };
    });
};

const formatReportForResponse = async (report, { organization = null } = {}) => {
    const reportObj = report.toObject ? report.toObject() : { ...report };

    let org = organization;
    if (!org && reportObj.tenantId) {
        const ensuredOrg = await ensureTenantOrganization(reportObj.tenantId);
        org = formatOrganizationResponse(ensuredOrg);
    }

    const formatted = enrichReportEventTime({
        id: reportObj._id.toString(),
        reportId: reportObj._id.toString(),
        tenantId: reportObj.tenantId?.toString() || null,
        recordType: reportObj.recordType,
        title: reportObj.title,
        description: reportObj.description,
        riskLevel: reportObj.riskLevel,
        status: reportObj.status,
        location: formatReportLocation(reportObj.location),
        organization: org,
        eventDate: reportObj.eventDate,
        eventTime: reportObj.eventTime,
        eventTimePeriod: reportObj.eventTimePeriod,
        eventTime24: reportObj.eventTime24,
        peopleAffected: reportObj.peopleAffected ?? null,
        injuryDetails: reportObj.injuryDetails ?? null,
        equipmentInvolved: reportObj.equipmentInvolved ?? null,
        attachments: reportObj.attachments || [],
        attachmentsCount: (reportObj.attachments || []).length,
        reportedBy: formatReporter(reportObj.reportedBy),
        comments: formatComments(reportObj.comments),
        commentsCount: Array.isArray(reportObj.comments) ? reportObj.comments.length : 0,
        deviceMeta: reportObj.deviceMeta || null,
        createdAt: reportObj.createdAt,
        updatedAt: reportObj.updatedAt,
        actions: reportObj.actions || []
    });

    delete formatted.adminComment;
    return formatted;
};

const formatReportsForResponse = async (reports) => {
    if (!reports.length) {
        return [];
    }

    const tenantIds = [
        ...new Set(
            reports
                .map((report) => {
                    const reportObj = report.toObject ? report.toObject() : report;
                    return reportObj.tenantId?.toString();
                })
                .filter(Boolean)
        )
    ];

    const organizationMap = new Map();

    await Promise.all(
        tenantIds.map(async (tenantId) => {
            const organization = await ensureTenantOrganization(tenantId);
            organizationMap.set(tenantId, formatOrganizationResponse(organization));
        })
    );

    return Promise.all(
        reports.map((report) => {
            const reportObj = report.toObject ? report.toObject() : report;
            const tenantId = reportObj.tenantId?.toString();

            return formatReportForResponse(report, {
                organization: tenantId ? organizationMap.get(tenantId) : null
            });
        })
    );
};

const buildReportNotificationData = (report) => ({
    reportId: report._id.toString(),
    recordType: report.recordType,
    riskLevel: report.riskLevel,
    title: report.title,
    status: report.status,
    clientId: report.location?.clientId?.toString?.()
        || report.location?.clientId
        || null,
    siteId: report.location?.siteId?.toString?.()
        || report.location?.siteId
        || null
});

const REPORT_POPULATE = [
    { path: "reportedBy.userId", select: "firstName lastName name email" },
    { path: "comments.commentedBy", select: "firstName lastName email role" },
    { path: "adminComment.commentedBy", select: "firstName lastName email role" },
    { path: "location.clientId", select: "name description" },
    { path: "location.siteId", select: "name" }
];

const fetchPopulatedReport = async (reportId) =>
    Report.findById(reportId).populate(REPORT_POPULATE);

module.exports = {
    REPORT_POPULATE,
    buildReportNotificationData,
    formatReportForResponse,
    formatReportsForResponse,
    fetchPopulatedReport
};
