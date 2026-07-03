// routes/device.routes.js
const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const { registerDevice, removeDevice } = require("../controller/device.controller");

router.use(auth);

router.post("/register", registerDevice);
router.delete("/unregister", removeDevice);

module.exports = router;