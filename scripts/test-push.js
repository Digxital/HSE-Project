// scripts/test-push.js
"use strict";

require("dotenv").config();

// ── Step 1: Validate env vars before anything else ────────────────────────────
const REQUIRED_ENV = [
    "FIREBASE_PROJECT_ID",
    "FIREBASE_CLIENT_EMAIL",
    "FIREBASE_PRIVATE_KEY",
    "MONGO_URI",
];

const missing = REQUIRED_ENV.filter((key) => !process.env[key]);
if (missing.length) {
    console.error("❌ Missing environment variables:", missing.join(", "));
    console.error("   Check your .env file");
    process.exit(1);
}

console.log("✅ Environment variables loaded");
console.log("   PROJECT_ID:   ", process.env.FIREBASE_PROJECT_ID);
console.log("   CLIENT_EMAIL: ", process.env.FIREBASE_CLIENT_EMAIL);
console.log(
    "   PRIVATE_KEY:  ",
    process.env.FIREBASE_PRIVATE_KEY?.substring(0, 30) + "..."
);

// ── Step 2: Initialize Firebase using SAME syntax as server.js ────────────────
let firebaseApp;

try {
    // ✅ Use modular syntax — matches your server.js
    const { initializeApp, cert } = require("firebase-admin/app");

    let privateKey = process.env.FIREBASE_PRIVATE_KEY;
    // Strip surrounding quotes if present and convert literal \n to newlines
    privateKey = privateKey.replace(/^"|"$/g, "").replace(/\\n/g, "\n");

    firebaseApp = initializeApp({
        credential: cert({
            projectId: process.env.FIREBASE_PROJECT_ID,
            clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
            privateKey,
        }),
    });

    console.log("✅ Firebase Admin initialized\n");
} catch (e) {
    console.error("❌ Firebase init failed:", e.message);
    console.error("\nPossible causes:");
    console.error("  1. firebase-admin not installed → run: npm install firebase-admin");
    console.error("  2. FIREBASE_PRIVATE_KEY format wrong in .env");
    console.error("  3. Firebase credentials invalid");
    process.exit(1);
}

// ── Step 3: Get messaging instance ────────────────────────────────────────────
const { getMessaging } = require("firebase-admin/messaging");
const mongoose = require("mongoose");

// ── Step 4: Minimal User schema ───────────────────────────────────────────────
const userSchema = new mongoose.Schema({
    firstName: String,
    lastName:  String,
    email:     String,
    fcmTokens: [
        {
            token:        String,
            platform:     String,
            registeredAt: Date,
        },
    ],
});

// Prevent model re-registration if somehow required elsewhere
const User = mongoose.models.User || mongoose.model("User", userSchema);

// ── Step 5: Test runner ───────────────────────────────────────────────────────
async function runTest() {
    // ── Connect to MongoDB ────────────────────────────────────────────────────
    console.log("📡 Connecting to MongoDB...");
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("✅ MongoDB connected\n");
    } catch (err) {
        console.error("❌ MongoDB connection failed:", err.message);
        process.exit(1);
    }

    // ── Find test user ────────────────────────────────────────────────────────
    const testEmail = "testuseruno@croxxtalent.com"; // ← your test user

    console.log(`🔍 Looking up user: ${testEmail}`);
    const user = await User.findOne({ email: testEmail }).lean();

    if (!user) {
        console.error("❌ User not found:", testEmail);
        console.error("   Fix: change testEmail to a valid user in your DB");
        await mongoose.disconnect();
        process.exit(1);
    }

    console.log(`✅ User: ${user.firstName} ${user.lastName}`);
    console.log(`   ID:   ${user._id}`);

    // ── Check FCM tokens ──────────────────────────────────────────────────────
    const tokens = (user.fcmTokens || []).map((t) => t.token).filter(Boolean);

    if (!tokens.length) {
        console.error("\n❌ No FCM tokens for this user");
        console.error("   Fix: open the Flutter app and log in to register a token");
        console.error(`   Check: db.users.findOne({ email: "${testEmail}" }, { fcmTokens: 1 })`);
        await mongoose.disconnect();
        process.exit(1);
    }

    console.log(`\n📱 Found ${tokens.length} FCM token(s):`);
    tokens.forEach((t, i) => {
        const platform = user.fcmTokens[i]?.platform ?? "unknown";
        console.log(`   [${i + 1}] ${t.substring(0, 50)}...`);
        console.log(`        platform: ${platform}`);
        console.log(`        registered: ${user.fcmTokens[i]?.registeredAt}`);
    });

    // ── Build message ─────────────────────────────────────────────────────────
    const title = "🔔 Test Push Notification";
    const body  = "If you see this, FCM is working end to end! ✅";

    const baseMessage = {
        notification: { title, body },
        data: {
            type:      "test_notification",
            timestamp: new Date().toISOString(),
            testId:    `test-${Date.now()}`,
        },
        android: {
            priority: "high",
            notification: {
                channelId:   "default_channel",
                sound:       "default",
                clickAction: "FLUTTER_NOTIFICATION_CLICK",
            },
        },
        apns: {
            headers: { "apns-priority": "10" },
            payload: {
                aps: {
                    sound: "default",
                    badge: 1,
                },
            },
        },
    };

    // ── Send push ─────────────────────────────────────────────────────────────
    console.log("\n📤 Sending push notification...");
    console.log(`   Title: ${title}`);
    console.log(`   Body:  ${body}`);

    const messaging = getMessaging();

    if (tokens.length === 1) {
        // ── Single device ─────────────────────────────────────────────────────
        try {
            const msgId = await messaging.send({
                ...baseMessage,
                token: tokens[0],
            });

            console.log("\n✅ Push sent successfully!");
            console.log(`   Message ID: ${msgId}`);
            console.log("   👀 Check your device now");

        } catch (err) {
            console.error("\n❌ Push failed:", err.message);
            console.error("   Error code:", err.code);

            const staleTokenCodes = [
                "messaging/invalid-registration-token",
                "messaging/registration-token-not-registered",
            ];

            if (staleTokenCodes.includes(err.code)) {
                console.warn("\n🗑️  Token is stale — clearing from MongoDB...");
                await User.updateOne(
                    { _id: user._id },
                    { $pull: { fcmTokens: { token: tokens[0] } } }
                );
                console.log("   Stale token cleared");
                console.log("   Fix: re-login to the Flutter app to register a fresh token");
            } else if (err.code === "messaging/invalid-argument") {
                console.error("\n   Fix: check FIREBASE_PROJECT_ID matches your Firebase project");
            } else if (err.message?.includes("auth")) {
                console.error("\n   Fix: check FIREBASE_PRIVATE_KEY and FIREBASE_CLIENT_EMAIL");
            }
        }

    } else {
        // ── Multiple devices ──────────────────────────────────────────────────
        try {
            const response = await messaging.sendEachForMulticast({
                ...baseMessage,
                tokens,
            });

            console.log(`\n✅ Multicast result:`);
            console.log(`   Success: ${response.successCount}/${tokens.length}`);
            console.log(`   Failure: ${response.failureCount}/${tokens.length}`);

            // Handle stale tokens
            const staleTokens = [];
            response.responses.forEach((resp, idx) => {
                if (!resp.success) {
                    console.error(
                        `   ❌ Token [${idx + 1}] failed: ${resp.error?.message}`
                    );
                    if (
                        resp.error?.code === "messaging/invalid-registration-token" ||
                        resp.error?.code === "messaging/registration-token-not-registered"
                    ) {
                        staleTokens.push(tokens[idx]);
                    }
                }
            });

            if (staleTokens.length) {
                console.warn(`\n🗑️  Clearing ${staleTokens.length} stale token(s)...`);
                await User.updateOne(
                    { _id: user._id },
                    { $pull: { fcmTokens: { token: { $in: staleTokens } } } }
                );
                console.log("   Done");
            }

            if (response.successCount > 0) {
                console.log("\n   👀 Check your device now");
            }

        } catch (err) {
            console.error("\n❌ Multicast failed:", err.message);
            console.error("   Code:", err.code);
        }
    }

    // ── Summary ───────────────────────────────────────────────────────────────
    console.log("\n" + "─".repeat(50));
    console.log("SUMMARY");
    console.log("─".repeat(50));
    console.log(`User:     ${user.firstName} ${user.lastName}`);
    console.log(`Email:    ${testEmail}`);
    console.log(`Tokens:   ${tokens.length}`);
    console.log("─".repeat(50));
    console.log("\n📋 Checklist:");
    console.log("   □ Notification appeared on device?");
    console.log("   □ Tapping notification opens correct screen?");
    console.log("   □ Notification appears when app is in foreground?");
    console.log("   □ Notification appears when app is in background?");
    console.log("   □ Notification appears when app is terminated?");

    await mongoose.disconnect();
    console.log("\n📡 MongoDB disconnected");
    process.exit(0);
}

runTest().catch((err) => {
    console.error("Unhandled error:", err);
    process.exit(1);
});