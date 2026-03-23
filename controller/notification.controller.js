const Notification = require("../model/notification.model");

// CREATE NOTIFICATION
exports.createNotification = async (req, res) => {
    try {
        const { type, title, description, read, data } = req.body;

        if (!type || !title || !description) {
            return res.status(400).json({
                success: false,
                message: "type, title, and description are required",
                data: {}
            });
        }

        const validTypes = [
            "user_added",
            "report_submitted",
            "action_closed",
            "action_progress"
        ];

        if (!validTypes.includes(type)) {
            return res.status(400).json({
                success: false,
                message: `Invalid type. Must be one of: ${validTypes.join(", ")}`,
                data: {}
            });
        }

        const notification = await Notification.create({
            user: req.user.id,
            type,
            title,
            description,
            read: read !== undefined ? read : false,
            data
        });

        const response = {
            id: notification._id.toString(),
            type: notification.type,
            title: notification.title,
            description: notification.description,
            timestamp: notification.createdAt.toISOString(),
            read: notification.read,
            data: notification.data || null
        };

        return res.status(201).json({
            success: true,
            message: "Notification created successfully",
            data: response
        });

    } catch (err) {
        console.error("Error creating notification:", err);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            data: {}
        });
    }
};

// GET NOTIFICATIONS (for logged in user)
exports.getNotifications = async (req, res) => {
    try {
        const notifications = await Notification.find({ user: req.user.id })
            .sort({ createdAt: -1 });

        const response = notifications.map((notification) => ({
            id: notification._id.toString(),
            type: notification.type,
            title: notification.title,
            description: notification.description,
            timestamp: notification.createdAt.toISOString(),
            read: notification.read,
            data: notification.data || null
        }));

        return res.status(200).json({
            success: true,
            message: "Notifications fetched successfully",
            data: response
        });

    } catch (err) {
        console.error("Error fetching notifications:", err);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            data: {}
        });
    }
};

// GET NOTIFICATION BY ID (for logged in user)
exports.getNotificationById = async (req, res) => {
    try {
        const notification = await Notification.findOne({
            _id: req.params.id,
            user: req.user.id
        });

        if (!notification) {
            return res.status(404).json({
                success: false,
                message: "Notification not found",
                data: {}
            });
        }

        const response = {
            id: notification._id.toString(),
            type: notification.type,
            title: notification.title,
            description: notification.description,
            timestamp: notification.createdAt.toISOString(),
            read: notification.read,
            data: notification.data || null
        };

        return res.status(200).json({
            success: true,
            message: "Notification fetched successfully",
            data: response
        });

    } catch (err) {
        console.error("Error fetching notification by ID:", err);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            data: {}
        });
    }
};