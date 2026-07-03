require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const helmet = require("helmet");
const cors = require("cors");

// Verify Cloudinary is configured
const cloudinary = require("cloudinary").v2;
if (!process.env.CLOUDINARY_CLOUD_NAME) {
    console.warn("⚠️  WARNING: CLOUDINARY_CLOUD_NAME not set in .env file");
} else {
    cloudinary.config({
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET
    });
    console.log("✅ Cloudinary configured with cloud name:", process.env.CLOUDINARY_CLOUD_NAME);
}
 
// Initialize Firebase with new syntax
const { initializeApp, cert } = require('firebase-admin/app');

try {
    let privateKey = process.env.FIREBASE_PRIVATE_KEY;
    if (privateKey) {
        privateKey = privateKey.replace(/^"|"$/g, '').replace(/\\n/g, '\n');
    }
    
    initializeApp({
        credential: cert({
            projectId: process.env.FIREBASE_PROJECT_ID,
            clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
            privateKey: privateKey,
        }),
    });
    
    console.log('✅ Firebase initialized');
} catch (error) {
    console.error('❌ Firebase init failed:', error.message);
}

const app = express();


// Security middleware
app.use(helmet()); 
app.use(cors({
    origin: [
        'http://localhost:3000', 
        'http://localhost:5173',
        "http://localhost:5000",
        "https://hse-frontend-eight.vercel.app",
        'https://www.hse-frontend-eight.vercel.app'
    ], // Add your React dev server ports
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "X-Requested-With",
      "x-platform",
      "cache-control",
    ],
    exposedHeaders: ["Content-Range", "X-Content-Range"],
}));
app.use(express.json({ limit: "10mb" }));

// ✅ SIMPLE HEALTH CHECK - NO DATABASE REQUIRED
app.get('/api/health', (req, res) => {
    res.status(200).json({
        uptime: process.uptime(),
        message: 'Server is running',
        timestamp: Date.now(),
        status: 'healthy'
    });
});

// Static files
app.use("/uploads", express.static("uploads"));

// Routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/admin", require("./routes/admin"));
app.use("/api/admin/auth", require("./routes/admin.auth"));
app.use("/api", require("./routes/dashboard"));
app.use("/api", require("./routes/client"));
app.use("/api", require("./routes/location"));
app.use("/api", require("./routes/report"));
app.use("/api", require("./routes/reportAction"));
app.use("/api/config", require("./routes/config"));
app.use("/api/incidents", require("./routes/incident"));
app.use("/api/inspections", require("./routes/inspection"));
app.use("/api/feedback", require("./routes/feedback.routes"));
app.use("/api/notifications", require("./routes/notification.routes"));
app.use("/api", require("./routes/certification"));
app.use("/api/auditlogs", require("./routes/auditLog"));
app.use("/api/microsoft", require("./routes/microsoft"));
app.use("/api/device", require("./routes/device.routes"));
app.use("/api", require("./routes/contactInquiry"));
app.use("/api", require("./routes/organization")); 
app.use("/api/superadmin", require("./routes/superAdmin.auth"));

// Database connection (runs in background)
mongoose
    .connect(process.env.MONGO_URI)
    .then(() => console.log("✅ MongoDB connected"))
    .catch(err => console.error("❌ MongoDB error:", err.message));

// Detailed health check with database status
app.get('/api/health/detailed', async (req, res) => {
    const dbState = mongoose.connection.readyState;
    res.json({
        uptime: process.uptime(),
        database: dbState === 1 ? 'connected' : 'disconnected',
        timestamp: Date.now()
    });
});

// Error handlers
app.use((req, res) => res.status(404).json({ error: "Route not found" }));
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: "Internal server error" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));