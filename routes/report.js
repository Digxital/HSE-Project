const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth");
const authorize = require("../middleware/authorize");
const { createReport } = require("../controller/report.controller");

// Field user & supervisor can submit reports
router.post(
    "/reports",
    auth,
    authorize(["FIELD_USER", "SUPERVISOR"], ["mobile", "web"]),
    createReport
);

module.exports = router;
