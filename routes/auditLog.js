const express = require("express");
const router = express.Router();
const auditLogController = require("../controller/auditLog.controller");
const auth = require("../middleware/auth");

// All routes require authentication and admin role
router.use(auth);

/**
 * GET /api/auditlogs
 * Get all audit logs for tenant (admin only)
 * Query params: page, limit, action, resourceType, userId
 */
router.get("/", auditLogController.getAuditLogs);

/**
 * GET /api/auditlogs/summary
 * Get audit logs summary and statistics (admin only)
 * Query params: days (default: 7)
 */
router.get("/summary", auditLogController.getAuditLogsSummary);

/**
 * GET /api/auditlogs/user/:userId
 * Get audit logs for a specific user
 * User can view their own, admins can view anyone's
 */
router.get("/user/:userId", auditLogController.getUserAuditLogs);

/**
 * GET /api/auditlogs/resource/:resourceId
 * Get audit logs for a specific resource (admin only)
 */
router.get("/resource/:resourceId", auditLogController.getResourceAuditLogs);

/**
 * GET /api/auditlogs/:logId
 * Get detailed view of a specific audit log (admin only)
 */
router.get("/:logId", auditLogController.getAuditLogDetail);

module.exports = router;
