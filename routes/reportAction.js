const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth");
const authorize = require("../middleware/authorize");
const {
    createReportAction,
    getMyActions,
    getReportActions,
    getActionById,
    updateActionStatus,
    reassignAction,
    addActionComment
} = require("../controller/reportAction.controller");

const allRoles = ["FIELD_USER", "SUPERVISOR", "HSE_OFFICER", "ADMIN"];

router.post(
    "/reports/:reportId/actions",
    auth,
    authorize(["ADMIN"], ["web"]),
    createReportAction
);

// Legacy alias retained for existing clients.
router.post(
    "/reports/:reportId/action",
    auth,
    authorize(["ADMIN"], ["web"]),
    createReportAction
);

router.get(
    "/reports/:reportId/actions",
    auth,
    authorize(allRoles, ["mobile", "web"]),
    getReportActions
);

router.get(
    "/actions/my",
    auth,
    authorize(allRoles, ["mobile", "web"]),
    getMyActions
);

router.get(
    "/actions/:id",
    auth,
    authorize(allRoles, ["mobile", "web"]),
    getActionById
);

router.patch(
    "/actions/:id/status",
    auth,
    authorize(allRoles, ["mobile", "web"]),
    updateActionStatus
);

router.patch(
    "/actions/:id/assign",
    auth,
    authorize(["ADMIN"], ["web"]),
    reassignAction
);

router.patch(
    "/actions/:id/comment",
    auth,
    authorize(allRoles, ["mobile", "web"]),
    addActionComment
);

module.exports = router;
