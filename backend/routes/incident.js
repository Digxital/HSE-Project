const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth");
const authorize = require("../middleware/authorize");
const validateObjectId = require("../middleware/validateObjectId");
const upload = require("../utils/multer");

const {
    createIncident,
    getIncidents,
    assignIncident,
    updateStatus,
    uploadAttachment
} = require("../controller/incident.controller");

router.use(auth);

// FIELD_USER only
router.post("/", authorize(["FIELD_USER"]), createIncident);

router.get("/", getIncidents);

// SUPERVISOR + ADMIN
router.patch(
    "/:id/assign",
    authorize(["SUPERVISOR", "ADMIN"]),
    validateObjectId,
    assignIncident
);

router.patch(
    "/:id/status",
    authorize(["SUPERVISOR", "ADMIN"]),
    validateObjectId,
    updateStatus
);

// All roles
router.post(
    "/:id/attachments",
    authorize(["FIELD_USER", "SUPERVISOR", "ADMIN"]),
    validateObjectId,
    upload.single("file"),
    uploadAttachment
);

module.exports = router;
