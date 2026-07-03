const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth");
const validateObjectId = require("../middleware/validateObjectId");
const {
	createNotification,
	getNotifications,
	getNotificationById,
	markAsRead,
	markAllAsRead
} = require("../controller/notification.controller");

router.use(auth);
 
router.post("/", createNotification);
router.get("/", getNotifications);
router.patch("/read-all", markAllAsRead);
router.get("/:id", validateObjectId, getNotificationById);
router.patch("/:id/read", validateObjectId, markAsRead);

module.exports = router; 