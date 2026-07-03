const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth");
const authorize = require("../middleware/authorize");
const { uploadGeneral } = require("../utils/multer");  
const { 
    createReport, 
    getReports, 
    getReportById,
    getReportsByUser,
    getReportsSummary,
    getReportsSummaryByEachUser,
    getMyReportsSummary,
    addReportComment,
    deleteReportComment,
    updateReportStatus
} = require("../controller/report.controller");

// Get reports summary/dashaboard
router.get(
    "/reports/summary",
    auth,
    authorize(["FIELD_USER", "SUPERVISOR", "HSE_OFFICER", "ADMIN"], ["mobile", "web"]),
    getReportsSummary
);

// Get reports summary for each user
router.get(
    "/reports/summary/by-user",
    auth,
    authorize(["SUPERVISOR", "HSE_OFFICER", "ADMIN"], ["mobile", "web"]),
    getReportsSummaryByEachUser
);

// Get my reports summary (for current user)
router.get(
    "/user/reports/summary",
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

// Admin comment on a report
router.patch(
    "/reports/:id/comment",
    auth,
    authorize(["ADMIN", "SUPERVISOR", "HSE_OFFICER", "FIELD_USER"], ["web", "mobile"]),
    addReportComment
);

// Admin delete a report comment
router.delete(
    "/reports/:id/comment/:commentId",
    auth,
    authorize(["ADMIN"], ["web"]),
    deleteReportComment
);
 
// Admin/supervisor update report status
router.patch(
    "/reports/:id/status",
    auth,
    authorize(["ADMIN", "SUPERVISOR"], ["web"]),
    updateReportStatus
);

// Field user & supervisor can submit reports with optional file attachments
router.post(
    "/reports",
    auth,
    authorize(["FIELD_USER", "SUPERVISOR", "HSE_OFFICER"], ["mobile", "web"]),
    uploadGeneral.array("files", 10),
    createReport
);

module.exports = router;
