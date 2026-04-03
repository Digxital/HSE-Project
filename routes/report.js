const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth");
const authorize = require("../middleware/authorize");
const { 
    createReport, 
    getReports, 
    getReportById,
    getReportsByUser,
    getReportsSummary,
    getReportsSummaryByEachUser,
    getMyReportsSummary
} = require("../controller/report.controller");

// Get reports summary/dashboard
router.get(
    "/reports/summary",
    auth,
    authorize(["FIELD_USER", "SUPERVISOR", "HSE_OFFICER", "ADMIN"], ["mobile", "web"]),
    getReportsSummary
);

// Get reports summary for each user
router.get(
    "/user/reports/summary",
    auth,
    authorize(["SUPERVISOR", "HSE_OFFICER", "ADMIN"], ["mobile", "web"]),
    getReportsSummaryByEachUser
);

// Get my reports summary (for current user)
router.get(
    "/reports/my-summary",
    auth,
    authorize(["FIELD_USER", "SUPERVISOR", "HSE_OFFICER", "ADMIN"], ["mobile", "web"]),
    getMyReportsSummary
);

// Get all reports with filtering and pagination
router.get(
    "/reports",
    auth,
    authorize(["FIELD_USER", "SUPERVISOR", "HSE_OFFICER", "ADMIN"], ["mobile", "web"]),
    getReports
);

// Get all reports submitted by a particular user
router.get(
    "/reports/user/:userId",
    auth,
    authorize(["FIELD_USER", "SUPERVISOR", "HSE_OFFICER", "ADMIN"], ["mobile", "web"]),
    getReportsByUser
);

// Get single report by ID
router.get(
    "/reports/:id",
    auth,
    authorize(["FIELD_USER", "SUPERVISOR", "HSE_OFFICER", "ADMIN"], ["mobile", "web"]),
    getReportById
);

// Field user & supervisor can submit reports
router.post(
    "/reports",
    auth,
    authorize(["FIELD_USER", "SUPERVISOR", "HSE_OFFICER"], ["mobile", "web"]),
    createReport
);

module.exports = router;
