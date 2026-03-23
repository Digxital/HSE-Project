const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth");
const validateObjectId = require("../middleware/validateObjectId");
const {
	createNotification,
	getNotifications,
	getNotificationById
} = require("../controller/notification.controller");

router.use(auth);

router.post("/", createNotification);
router.get("/", getNotifications);
router.get("/:id", validateObjectId, getNotificationById);

module.exports = router;