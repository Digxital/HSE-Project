// utils/fcm.js
const { getMessaging } = require("firebase-admin/messaging");
const User = require("../model/user.model");

// ─── Constants ────────────────────────────────────────────────────────────────
const FCM_BATCH_LIMIT = 500; // Firebase multicast hard limit

const STALE_TOKEN_CODES = new Set([
    "messaging/registration-token-not-registered",
    "messaging/invalid-registration-token",
    "messaging/invalid-argument",
]);

// ─── Helpers ──────────────────────────────────────────────────────────────────

/**
 * FCM data payload values MUST all be strings.
 * Removes null/undefined keys entirely.
 */
const sanitizeData = (data = {}) => {
    const result = {};
    for (const [key, value] of Object.entries(data)) {
        if (value !== null && value !== undefined) {
            result[key] = String(value);
        }
    }
    return result;
};

/**
 * Build a platform-optimised FCM message object.
 */
const buildMessage = ({ token, tokens, title, body, data }) => {
    const sanitized = sanitizeData(data);
    const target = token ? { token } : { tokens };

    return {
        ...target,
        notification: { title, body },
        data: sanitized,
        android: {
            priority: "high",
            notification: {
                channelId: "default_channel",
                sound: "default",
                clickAction: "FLUTTER_NOTIFICATION_CLICK",
            },
        },
        apns: {
            headers: { "apns-priority": "10" },
            payload: {
                aps: {
                    sound: "default",
                    badge: 1,
                    contentAvailable: true,
                },
            },
        },
        webpush: {
            headers: { Urgency: "high" },
        },
    };
};

/**
 * Remove stale/invalid tokens from a user document.
 */
const clearStaleTokensForUser = async (userId, staleTokens = []) => {
    if (!staleTokens.length) return;
    try {
        await User.findByIdAndUpdate(userId, {
            $pull: { fcmTokens: { token: { $in: staleTokens } } },
        });
        console.warn(
            `🗑️  Cleared ${staleTokens.length} stale token(s) for user ${userId}`
        );
    } catch (err) {
        console.error("Failed to clear stale tokens:", err.message);
    }
};

/**
 * Split an array into chunks of `size`.
 */
const chunk = (arr, size) =>
    Array.from({ length: Math.ceil(arr.length / size) }, (_, i) =>
        arr.slice(i * size, i * size + size)
    );

// ─── Core send functions ──────────────────────────────────────────────────────

/**
 * Send a push notification to ONE user (all their devices).
 *
 * @param {string}  userId
 * @param {{ title: string, body: string, data?: object }} payload
 * @returns {{ success: boolean, sent: number, reason?: string }}
 */
const sendPushToUser = async (userId, { title, body, data = {} }) => {
    try {
        const user = await User.findById(userId)
            .select("fcmTokens")
            .lean();

        if (!user) {
            console.warn(`⚠️  User not found for push: ${userId}`);
            return { success: false, sent: 0, reason: "user_not_found" };
        }

        const tokens = (user.fcmTokens || []).map((t) => t.token);

        if (!tokens.length) {
            console.warn(`⚠️  No FCM tokens for user: ${userId}`);
            return { success: false, sent: 0, reason: "no_fcm_tokens" };
        }

        // Single device — use send(); multiple — use sendEachForMulticast()
        if (tokens.length === 1) {
            const message = buildMessage({ token: tokens[0], title, body, data });
            try {
                const msgId = await getMessaging().send(message);
                console.log(`✅ Push sent to user ${userId} [1 device]:`, msgId);
                return { success: true, sent: 1 };
            } catch (err) {
                if (STALE_TOKEN_CODES.has(err.code)) {
                    await clearStaleTokensForUser(userId, tokens);
                    return { success: false, sent: 0, reason: "stale_token" };
                }
                throw err;
            }
        }

        // Multi-device — batch into groups of 500
        const batches = chunk(tokens, FCM_BATCH_LIMIT);
        let totalSent = 0;
        const staleTokens = [];

        for (const batchTokens of batches) {
            const message = buildMessage({ tokens: batchTokens, title, body, data });
            const response = await getMessaging().sendEachForMulticast(message);

            response.responses.forEach((resp, idx) => {
                if (resp.success) {
                    totalSent++;
                } else if (STALE_TOKEN_CODES.has(resp.error?.code)) {
                    staleTokens.push(batchTokens[idx]);
                } else {
                    console.error(
                        `Push failed [user=${userId}, token=${batchTokens[idx]}]:`,
                        { code: resp.error?.code, message: resp.error?.message }
                    );
                }
            });
        }

        if (staleTokens.length) {
            await clearStaleTokensForUser(userId, staleTokens);
        }

        console.log(
            `✅ Push sent to user ${userId}: ${totalSent}/${tokens.length} devices`
        );
        return { success: totalSent > 0, sent: totalSent };

    } catch (err) {
        console.error(`❌ sendPushToUser failed [user=${userId}]:`, {
            code: err.code,
            message: err.message,
        });
        return { success: false, sent: 0, reason: "send_error" };
    }
};

/**
 * Send a push notification to MANY users efficiently.
 * Fetches all tokens in one DB query, batches into FCM multicast groups.
 *
 * @param {string[]} userIds
 * @param {{ title: string, body: string, data?: object }} payload
 * @returns {{ successCount: number, failureCount: number }}
 */
const sendPushToMany = async (userIds, { title, body, data = {} }) => {
    try {
        if (!userIds?.length) return { successCount: 0, failureCount: 0 };

        // One query for all users
        const users = await User.find({
            _id: { $in: userIds },
            fcmTokens: { $exists: true, $not: { $size: 0 } },
        })
            .select("_id fcmTokens")
            .lean();

        if (!users.length) {
            console.warn("⚠️  No FCM tokens found for any target users");
            return { successCount: 0, failureCount: userIds.length };
        }

        // Build a token → userId map for stale-token cleanup
        const tokenUserMap = {};
        const allTokens = [];

        for (const user of users) {
            for (const { token } of user.fcmTokens) {
                tokenUserMap[token] = user._id.toString();
                allTokens.push(token);
            }
        }

        const batches = chunk(allTokens, FCM_BATCH_LIMIT);
        let totalSent = 0;
        let totalFailed = 0;

        // Group stale tokens by user for efficient cleanup
        const staleByUser = {};

        for (const batchTokens of batches) {
            const message = buildMessage({ tokens: batchTokens, title, body, data });
            const response = await getMessaging().sendEachForMulticast(message);

            response.responses.forEach((resp, idx) => {
                if (resp.success) {
                    totalSent++;
                } else {
                    totalFailed++;
                    if (STALE_TOKEN_CODES.has(resp.error?.code)) {
                        const token = batchTokens[idx];
                        const uid = tokenUserMap[token];
                        if (!staleByUser[uid]) staleByUser[uid] = [];
                        staleByUser[uid].push(token);
                    } else {
                        console.error(
                            `Push failed [token=${batchTokens[idx]}]:`,
                            { code: resp.error?.code, message: resp.error?.message }
                        );
                    }
                }
            });
        }

        // Clean up stale tokens concurrently
        const cleanupTasks = Object.entries(staleByUser).map(([uid, tokens]) =>
            clearStaleTokensForUser(uid, tokens)
        );
        await Promise.allSettled(cleanupTasks);

        console.log(
            `✅ Bulk push: ${totalSent} sent, ${totalFailed} failed (${users.length} users, ${allTokens.length} tokens)`
        );

        return { successCount: totalSent, failureCount: totalFailed };

    } catch (err) {
        console.error("❌ sendPushToMany failed:", {
            code: err.code,
            message: err.message,
        });
        return { successCount: 0, failureCount: userIds.length };
    }
};

module.exports = { sendPushToUser, sendPushToMany };