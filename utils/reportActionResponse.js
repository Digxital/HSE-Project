const MANAGEMENT_ROLES = ["ADMIN", "SUPERVISOR", "HSE_OFFICER"];
const { enrichReportEventTime } = require("./eventTime");

const toPlainObject = value => {
    if (!value) {
        return value;
    }

    return typeof value.toObject === "function"
        ? value.toObject()
        : { ...value };
};

const serializeActionUser = (user, includePrivateFields) => {
    if (!user || typeof user !== "object") {
        return user;
    }

    const userObj = toPlainObject(user);
    const serializedUser = {
        _id: userObj._id,
        firstName: userObj.firstName,
        lastName: userObj.lastName,
        role: userObj.role
    };

    if (includePrivateFields) {
        serializedUser.email = userObj.email;
        serializedUser.status = userObj.status;
    }

    return serializedUser;
};

const serializeReportUser = (report, includePrivateFields) => {
    if (
        !report
        || !report.reportedBy
        || !report.reportedBy.userId
        || typeof report.reportedBy.userId !== "object"
    ) {
        return;
    }

    report.reportedBy.userId = serializeActionUser(
        report.reportedBy.userId,
        includePrivateFields
    );
};

const serializeReportAction = (action, viewer) => {
    const actionObj = toPlainObject(action);
    const includePrivateFields = Boolean(
        viewer && MANAGEMENT_ROLES.includes(viewer.role)
    );

    delete actionObj.tenantId;

    actionObj.assignedTo = serializeActionUser(
        actionObj.assignedTo,
        includePrivateFields
    );
    actionObj.createdBy = serializeActionUser(
        actionObj.createdBy,
        includePrivateFields
    );

    if (actionObj.report && typeof actionObj.report === "object") {
        actionObj.report = enrichReportEventTime(toPlainObject(actionObj.report));
        serializeReportUser(actionObj.report, includePrivateFields);
    }

    return actionObj;
};

module.exports = {
    MANAGEMENT_ROLES,
    serializeReportAction
};
