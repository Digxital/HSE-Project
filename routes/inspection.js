const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth");
const authorize = require("../middleware/authorize");

const {
  createInspection,
  assignInspector,
  submitInspection,
  getInspections
} = require("../controller/inspection.controller");

// Create Inspection (Web)
router.post(
  "/",
  auth,
  authorize(["SUPERVISOR", "ADMIN"], ["web"]),
  createInspection
);

// Assign Inspector (Web)
router.patch(
  "/:id/assign",
  auth,
  authorize(["SUPERVISOR", "ADMIN"], ["web"]),
  assignInspector
);

// Submit Inspection (Mobile)
router.patch(
  "/:id/submit",
  auth,
  authorize(["SUPERVISOR", "FIELD_USER"], ["mobile"]),
  submitInspection
);

// Get Inspections
router.get(
  "/",
  auth,
  authorize(["SUPERVISOR", "FIELD_USER", "ADMIN"], ["web", "mobile"]),
  getInspections
);

module.exports = router;