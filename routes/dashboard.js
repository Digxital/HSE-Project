const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth");
const authorize = require("../middleware/authorize");

// Dashboard access, ADMIN + SUPERVISOR only (web)

router.get(
    "/dashboard",
    auth,
    authorize(["ADMIN", "SUPERVISOR"], ["web"]),
    (req, res) => {
        res.json({
            message: "Dashboard access granted",
            role: req.user.role
        });
    }
);

module.exports = router;
