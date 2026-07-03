// utils/notify.js  ← use this everywhere in your app
const Notification = require("../model/notification.model");
const { sendPushToUser, sendPushToMany } = require("./fcm");

/**
 * Create a DB notification + send push to ONE user.
 *
 * @param {{
 *   userId: string,
 *   type: string,
 *   title: string,
 *   description: string,
 *   data?: object
 * }} options
 */
const notifyUser = async ({ userId, type, title, description, data = {} }) => {
    try {
        const notification = await Notification.create({
            user: userId,
            type,
            title,
            description,
            read: false,
            data,
        });

        sendPushToUser(userId, {
            title,
            body: description,
            data: {
                type,
                notificationId: notification._id.toString(),
                ...data,
            },
        }).catch((err) =>
            console.error(
                `Push failed [notificationId=${notification._id}]:`,
                err.message
            )
        );

        return notification;
    } catch (err) {
        console.error("notifyUser error:", err);
        return null;
    }
};

/**
 * Create DB notifications + send push to MANY users at once.
 *
 * @param {{
 *   userIds: string[],
 *   type: string,
 *   title: string,
 *   description: string,
 *   data?: object
 * }} options
 */
const notifyMany = async ({ userIds, type, title, description, data = {} }) => {
    try {
        if (!userIds?.length) return;

        // Bulk insert all notifications
        const docs = userIds.map((userId) => ({
            user: userId,
            type,
            title,
            description,
            read: false,
            data,
        }));

        const notifications = await Notification.insertMany(docs, {
            ordered: false,
        });

        // Build a userId → notificationId map for per-user data
        const notifMap = {};
        for (const n of notifications) {
            notifMap[n.user.toString()] = n._id.toString();
        }

        // Push to all users — non-blocking
        sendPushToMany(userIds, {
            title,
            body: description,
            data: { type, ...data },
        }).catch((err) => console.error("Bulk push failed:", err.message));

        return notifications;
    } catch (err) {
        console.error("notifyMany error:", err);
        return null;
    }
};

module.exports = { notifyUser, notifyMany };