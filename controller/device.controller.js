// controller/device.controller.js
const User = require("../model/user.model");

const MAX_TOKENS_PER_USER = 5; // prevent unbounded growth

/**
 * POST /api/device/register
 * Body: { fcmToken: string, platform: "android" | "ios" | "web" }
 */
exports.registerDevice = async (req, res) => {
    try {
        const { fcmToken, platform = "android" } = req.body;

        if (!fcmToken || typeof fcmToken !== "string") {
            return res.status(400).json({
                success: false,
                message: "fcmToken is required and must be a string",
            });
        }

        const validPlatforms = ["android", "ios", "web"];
        if (!validPlatforms.includes(platform)) {
            return res.status(400).json({
                success: false,
                message: `platform must be one of: ${validPlatforms.join(", ")}`,
            });
        }

        // ── Step 1: Remove this token from ANY other user (token hijack prevention)
        await User.updateMany(
            {
                _id: { $ne: req.user.id },
                "fcmTokens.token": fcmToken,
            },
            { $pull: { fcmTokens: { token: fcmToken } } }
        );

        // ── Step 2: Upsert token for this user
        const user = await User.findById(req.user.id).select("fcmTokens");
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        const exists = user.fcmTokens.some((t) => t.token === fcmToken);

        if (exists) {
            // Update registeredAt so we know this token is still active
            await User.updateOne(
                { _id: req.user.id, "fcmTokens.token": fcmToken },
                {
                    $set: {
                        "fcmTokens.$.platform": platform,
                        "fcmTokens.$.registeredAt": new Date(),
                    },
                }
            );
        } else {
            // Enforce max tokens — remove oldest first
            if (user.fcmTokens.length >= MAX_TOKENS_PER_USER) {
                const sorted = [...user.fcmTokens].sort(
                    (a, b) => new Date(a.registeredAt) - new Date(b.registeredAt)
                );
                const toRemove = sorted
                    .slice(0, user.fcmTokens.length - MAX_TOKENS_PER_USER + 1)
                    .map((t) => t.token);

                await User.updateOne(
                    { _id: req.user.id },
                    { $pull: { fcmTokens: { token: { $in: toRemove } } } }
                );
            }

            await User.updateOne(
                { _id: req.user.id },
                {
                    $push: {
                        fcmTokens: {
                            token: fcmToken,
                            platform,
                            registeredAt: new Date(),
                        },
                    },
                }
            );
        }

        console.log(
            `📱 Device registered [user=${req.user.id}, platform=${platform}]`
        );

        return res.status(200).json({
            success: true,
            message: "Device registered successfully",
        });

    } catch (err) {
        console.error("Device registration error:", err);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};

/**
 * DELETE /api/device/unregister
 * Body: { fcmToken: string }  — unregister specific device
 * Body: {}                    — unregister ALL devices (logout)
 */
exports.removeDevice = async (req, res) => {
    try {
        const { fcmToken } = req.body;

        if (fcmToken) {
            // Remove specific token
            await User.updateOne(
                { _id: req.user.id },
                { $pull: { fcmTokens: { token: fcmToken } } }
            );
            console.log(`📴 Token removed [user=${req.user.id}]`);
        } else {
            // Remove all tokens (full logout)
            await User.updateOne(
                { _id: req.user.id },
                { $set: { fcmTokens: [] } }
            );
            console.log(`📴 All tokens cleared [user=${req.user.id}]`);
        }

        return res.status(200).json({
            success: true,
            message: fcmToken
                ? "Device unregistered successfully"
                : "All devices unregistered successfully",
        });

    } catch (err) {
        console.error("Device unregister error:", err);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};