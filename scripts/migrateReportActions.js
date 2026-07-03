require("dotenv").config();
const mongoose = require("mongoose");

const Report = require("../model/report.model");
const ReportAction = require("../model/reportAction.model");
const User = require("../model/user.model");

const resolveUser = async (identifier, tenantId) => {
    if (!identifier) {
        return null;
    }

    const value = String(identifier).trim();
    if (!value) {
        return null;
    }

    const identityFilter = mongoose.Types.ObjectId.isValid(value)
        ? { _id: value }
        : { email: value };

    return User.findOne({
        ...identityFilter,
        tenantId
    }).select("_id");
};

const migrateReportActions = async () => {
    if (!process.env.MONGO_URI) {
        throw new Error("MONGO_URI is required");
    }

    await mongoose.connect(process.env.MONGO_URI);

    const reports = await Report.collection
        .find({ "actions.0": { $exists: true } })
        .toArray();

    let migratedActions = 0;
    let cleanedReports = 0;
    let skippedActions = 0;

    for (const report of reports) {
        const reportOwner = await User.findById(
            report.reportedBy && report.reportedBy.userId
        ).select("tenantId");

        if (!reportOwner) {
            skippedActions += report.actions.length;
            console.warn(`Skipping report ${report._id}: report owner was not found`);
            continue;
        }

        let allActionsMigrated = true;

        for (const legacyAction of report.actions) {
            const existingAction = await ReportAction.exists({
                _id: legacyAction._id
            });

            if (existingAction) {
                continue;
            }

            const [assignedUser, creator] = await Promise.all([
                resolveUser(legacyAction.assignedTo, reportOwner.tenantId),
                resolveUser(
                    legacyAction.createdBy && (
                        legacyAction.createdBy.id
                        || legacyAction.createdBy.email
                    ),
                    reportOwner.tenantId
                )
            ]);

            if (!assignedUser || !creator) {
                allActionsMigrated = false;
                skippedActions += 1;
                console.warn(
                    `Skipping action ${legacyAction._id} on report ${report._id}: user reference was not found`
                );
                continue;
            }

            await ReportAction.create({
                _id: legacyAction._id,
                tenantId: reportOwner.tenantId,
                report: report._id,
                actionTitle: legacyAction.actionTitle,
                assignedTo: assignedUser._id,
                dueDate: legacyAction.dueDate,
                priority: legacyAction.priority || "Medium",
                description: legacyAction.description,
                status: legacyAction.status || "open",
                createdBy: creator._id,
                completedAt: legacyAction.status === "completed"
                    ? legacyAction.updatedAt || legacyAction.createdAt || new Date()
                    : null,
                createdAt: legacyAction.createdAt,
                updatedAt: legacyAction.updatedAt || legacyAction.createdAt
            });

            migratedActions += 1;
        }

        if (allActionsMigrated) {
            await Report.collection.updateOne(
                { _id: report._id },
                { $unset: { actions: "" } }
            );
            cleanedReports += 1;
        }
    }

    console.log(JSON.stringify({
        reportsFound: reports.length,
        migratedActions,
        skippedActions,
        cleanedReports
    }, null, 2));
};

migrateReportActions()
    .catch(error => {
        console.error("Report action migration failed:", error);
        process.exitCode = 1;
    })
    .finally(async () => {
        await mongoose.disconnect();
    });
