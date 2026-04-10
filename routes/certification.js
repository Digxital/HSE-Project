const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth");
const authorize = require("../middleware/authorize");
const validateObjectId = require("../middleware/validateObjectId");

const {
  getUserCertifications,
  getJobTypeRequirements,
  getUserComplianceStatus,
  createCertification,
  updateCertification,
  deleteCertification
} = require("../controller/certification.controller");

/**
 * GET /users/:id/certifications
 * Return all certifications for a specific user
 * Accessible by: ADMIN or the same user
 */
router.get(
  "/users/:id/certifications",
  auth,
  validateObjectId,
  getUserCertifications
);

/**
 * GET /job-types/:id/requirements
 * Return required certifications for a job type
 * Accessible by: All authenticated users
 */
router.get(
  "/job-types/:id/requirements",
  auth,
  validateObjectId,
  getJobTypeRequirements
);

/**
 * GET /users/:id/compliance-status
 * Compare user's certifications with job type requirements
 * Query params: jobTypeId (optional)
 * Accessible by: ADMIN or the same user
 */
router.get(
  "/users/:id/compliance-status",
  auth,
  validateObjectId,
  getUserComplianceStatus
);

/**
 * POST /api/admin/users/:userId/certifications
 * Admin only - Create a certification for a user
 */
router.post(
  "/admin/users/:userId/certifications",
  auth,
  authorize(["ADMIN"]),
  createCertification
);

/**
 * PUT /certifications/:id
 * Admin only - Update certification
 * Blocked if user is under investigation
 */
router.put(
  "/certifications/:id",
  auth,
  authorize(["ADMIN"]),
  validateObjectId,
  updateCertification
);

/**
 * DELETE /certifications/:id
 * Admin only - Delete certification
 * Blocked if user is under investigation
 */
router.delete(
  "/certifications/:id",
  auth,
  authorize(["ADMIN"]),
  validateObjectId,
  deleteCertification
);

module.exports = router;
