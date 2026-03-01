const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth");
const { createNotification } = require("../controller/notification.controller");


router.post("/", auth, createNotification);

module.exports = router;