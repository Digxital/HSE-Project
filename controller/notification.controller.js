const Notification = require("../model/notification.model");

const convertObjectIds = (obj) => {
    if (obj === null || obj === undefined) return null;
    if (typeof obj !== "object") return obj;
    if (Array.isArray(obj)) {
        return obj.map((item) => convertObjectIds(item));
    } 
    const converted = {};
    for (const key in obj) {
        const value = obj[key];
        if (value && typeof value === "object" && value.constructor.name === "ObjectId") {
            converted[key] = value.toString();
        } else if (value && typeof value === "object") {
            converted[key] = convertObjectIds(value);
        } else {
            converted[key] = value;
        }
    }
    return converted;
};

const buildNotificationResponse = (notification) => {
    const notificationObj = notification.toObject();

    return {
        id: notificationObj._id.toString(),
        type: notificationObj.type,
        title: notificationObj.title,
        description: notificationObj.description,
        timestamp: notificationObj.createdAt.toISOString(),
        read: notificationObj.read,
        data: notificationObj.data ? convertObjectIds(notificationObj.data) : null
    };
};

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
            "report_commented",
            "action_assigned",
            "action_closed",
            "action_progress",
            "certificate_added",
            "certificate_updated",
            "organization_created"
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

        const response = buildNotificationResponse(notification);

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

// GET NOTIFICATIONS
exports.getNotifications = async (req, res) => {
    try {
        const notifications = await Notification.find({ user: req.user.id })
            .sort({ createdAt: -1 });

        const response = notifications.map((notification) => buildNotificationResponse(notification));

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

// GET NOTIFICATION BY ID
exports.getNotificationById = async (req, res) => {
    try {
        const notification = await Notification.findById(req.params.id);

        if (!notification) {
            return res.status(404).json({
                success: false,
                message: "Notification not found",
                data: {}
            });
        }

        if (notification.user.toString() !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: "Access denied",
                data: {}
            });
        }
        const response = buildNotificationResponse(notification);

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

// MARK NOTIFICATION AS READ
exports.markAsRead = async (req, res) => {
    try {
        const notification = await Notification.findById(req.params.id);

        if (!notification) {
            return res.status(404).json({
                success: false,
                message: "Notification not found",
                data: {}
            });
        }

        if (notification.user.toString() !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: "Access denied",
                data: {}
            });
        }

        if (!notification.read) {
            notification.read = true;
            await notification.save();
        }

        const response = buildNotificationResponse(notification);

        return res.status(200).json({
            success: true,
            message: "Notification marked as read",
            data: response
        });

    } catch (err) {
        console.error("Error marking notification as read:", err);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            data: {}
        });
    }
};

// MARK ALL NOTIFICATIONS AS READ
exports.markAllAsRead = async (req, res) => {
    try {
        const result = await Notification.updateMany(
            { user: req.user.id, read: false },
            { $set: { read: true } }
        );

        return res.status(200).json({
            success: true,
            message: "All notifications marked as read",
            data: {
                updatedCount: result.modifiedCount
            }
        });

    } catch (err) {
        console.error("Error marking all notifications as read:", err);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            data: {}
        });
    }
};
