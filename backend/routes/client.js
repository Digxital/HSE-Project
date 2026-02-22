const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth");
const authorize = require("../middleware/authorize");
const {
    createClient,
    getClients
} = require("../controller/client.controller");

// Admin only 
router.post(
    "/clients",
    auth,
    authorize(["ADMIN"], ["web"]),
    createClient
);

// Admin & Supervisor (for dropdown)
router.get(
    "/clients",
    auth,
    authorize(["ADMIN", "SUPERVISOR"], ["web"]),
    getClients
);

module.exports = router;
