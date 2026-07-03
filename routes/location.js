const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth");
const authorize = require("../middleware/authorize");
const { createLocation } = require("../controller/location.controller");

// Admin only
router.post(
    "/clients/:clientId/locations",
    auth,
    authorize(["ADMIN"], ["web"]),
    createLocation
);

module.exports = router;
