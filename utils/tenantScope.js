const mongoose = require("mongoose");
const User = require("../model/user.model");

const normalizeTenantId = (tenantId) => {
    if (!tenantId) {
        return null;
    }

    if (tenantId instanceof mongoose.Types.ObjectId) {
        return tenantId;
    }

    const value = String(tenantId).trim();
    if (!mongoose.Types.ObjectId.isValid(value)) {
        return null;
    }

    return new mongoose.Types.ObjectId(value);
};

const getTenantUserIds = async (tenantId) => {
    const normalizedTenantId = normalizeTenantId(tenantId);
    if (!normalizedTenantId) {
        return [];
    }

    const users = await User.find({ tenantId: normalizedTenantId }).select("_id").lean();
    return users.map(user => user._id);
};

const userBelongsToTenant = async (userId, tenantId) => {
    if (!userId || !tenantId) {
        return false;
    }

    return Boolean(await User.exists({
        _id: userId,
        tenantId: normalizeTenantId(tenantId)
    }));
};

const findUserInTenant = async (userId, tenantId) => {
    const normalizedTenantId = normalizeTenantId(tenantId);
    if (!userId || !normalizedTenantId) {
        return null;
    }

    return User.findOne({
        _id: userId,
        tenantId: normalizedTenantId
    });
};

const buildTenantDocumentFilter = (tenantId) => ({
    tenantId: normalizeTenantId(tenantId)
});

const buildReportScopeFilter = async ({ tenantId, role, userId }) => {
    if (role === "FIELD_USER" && userId) {
        return { "reportedBy.userId": userId };
    }

    const normalizedTenantId = normalizeTenantId(tenantId);
    const tenantUserIds = await getTenantUserIds(tenantId);
    const scopeConditions = [{ tenantId: normalizedTenantId }];

    if (tenantUserIds.length > 0) {
        scopeConditions.push({
            tenantId: { $exists: false },
            "reportedBy.userId": { $in: tenantUserIds }
        });
    }

    return { $or: scopeConditions };
};

const reportBelongsToTenant = async (report, tenantId) => {
    if (!report || !tenantId) {
        return false;
    }

    const normalizedTenantId = normalizeTenantId(tenantId);

    if (report.tenantId && report.tenantId.toString() === normalizedTenantId.toString()) {
        return true;
    }

    const reporterId = report.reportedBy?.userId?._id || report.reportedBy?.userId;
    if (!reporterId) {
        return false;
    }

    return userBelongsToTenant(reporterId, tenantId);
};

const buildIncidentScopeFilter = async ({ tenantId, role, userId }) => {
    if (role === "FIELD_USER" && userId) {
        return { reportedBy: userId };
    }

    const normalizedTenantId = normalizeTenantId(tenantId);
    const tenantUserIds = await getTenantUserIds(tenantId);
    const scopeConditions = [{ tenantId: normalizedTenantId }];

    if (tenantUserIds.length > 0) {
        scopeConditions.push({
            tenantId: { $exists: false },
            reportedBy: { $in: tenantUserIds }
        });
    }

    return { $or: scopeConditions };
};

const incidentBelongsToTenant = async (incident, tenantId) => {
    if (!incident || !tenantId) {
        return false;
    }

    const normalizedTenantId = normalizeTenantId(tenantId);

    if (incident.tenantId && incident.tenantId.toString() === normalizedTenantId.toString()) {
        return true;
    }

    const reporterId = incident.reportedBy?._id || incident.reportedBy;
    if (!reporterId) {
        return false;
    }

    return userBelongsToTenant(reporterId, tenantId);
};

const buildInspectionScopeFilter = async ({ tenantId, role, userId }) => {
    if (role === "FIELD_USER" && userId) {
        return { assignedTo: userId };
    }

    const normalizedTenantId = normalizeTenantId(tenantId);
    const tenantUserIds = await getTenantUserIds(tenantId);
    const scopeConditions = [{ tenantId: normalizedTenantId }];

    if (tenantUserIds.length > 0) {
        scopeConditions.push({
            tenantId: { $exists: false },
            createdBy: { $in: tenantUserIds }
        });
    }

    return { $or: scopeConditions };
};

const inspectionBelongsToTenant = async (inspection, tenantId) => {
    if (!inspection || !tenantId) {
        return false;
    }

    const normalizedTenantId = normalizeTenantId(tenantId);

    if (inspection.tenantId && inspection.tenantId.toString() === normalizedTenantId.toString()) {
        return true;
    }

    const creatorId = inspection.createdBy?._id || inspection.createdBy;
    if (!creatorId) {
        return false;
    }

    return userBelongsToTenant(creatorId, tenantId);
};

const clientBelongsToTenant = async (clientId, tenantId) => {
    const Client = require("../model/client.model");
    const client = await Client.findById(clientId);

    if (!client || !client.tenantId) {
        return false;
    }

    return client.tenantId.toString() === normalizeTenantId(tenantId).toString();
};

const buildCertificationScopeFilter = async (tenantId) => {
    const tenantUserIds = await getTenantUserIds(tenantId);

    if (tenantUserIds.length === 0) {
        return { userId: { $in: [] } };
    }

    return { userId: { $in: tenantUserIds } };
};

module.exports = {
    normalizeTenantId,
    getTenantUserIds,
    userBelongsToTenant,
    findUserInTenant,
    buildTenantDocumentFilter,
    buildReportScopeFilter,
    reportBelongsToTenant,
    buildIncidentScopeFilter,
    incidentBelongsToTenant,
    buildInspectionScopeFilter,
    inspectionBelongsToTenant,
    clientBelongsToTenant,
    buildCertificationScopeFilter
};
