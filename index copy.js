const nodePath = require("path");
require("dotenv").config({ path: nodePath.join(__dirname, ".env") });

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

// ========== CONSTANTS ==========
const PORT = process.env.PORT || 5000;
const NODE_ENV = process.env.NODE_ENV || "development";

// ========== ALLOWED ORIGINS ==========
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  "http://localhost:5175",
  "http://localhost:5000",
  "http://127.0.0.1:5173",
  "http://127.0.0.1:5174",
  "http://127.0.0.1:5175",
  "http://127.0.0.1:5000",
  "https://hse-frontend-eight.vercel.app",
  "https://www.hse-frontend-eight.vercel.app",
  process.env.FRONTEND_URL,
].filter(Boolean);

// ========== CORS ==========
app.use(
  cors({ 
    origin: function (origin, callback) {
      // Allow Postman / curl (no origin)
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      console.warn(`🚫 Blocked origin: ${origin}`);
      return callback(null, false);
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "X-Requested-With",
      "x-platform",
      "cache-control",
    ],
    exposedHeaders: ["Content-Range", "X-Content-Range"],
  })
);

// Handle OPTIONS preflight for ALL routes
app.options('/{*path}', cors());

// ========== CORE MIDDLEWARE ==========
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static("uploads"));

// ========== REQUEST LOGGER ==========
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url} — Origin: ${req.headers.origin || "none"}`);
  next();
});

// ========== DATABASE CONNECTION ==========
const connectDB = async () => {
  const mongoURI = process.env.MONGO_URI;

  if (!mongoURI) {
    console.warn("⚠️  MONGO_URI not set — running without database");
    return;
  }

  try {
    await mongoose.connect(mongoURI);
    console.log("✅ MongoDB connected");
  } catch (err) {
    console.error("❌ MongoDB connection failed:", err.message);
    process.exit(1); // Exit if DB is required
  }
};

// ========== ROUTE DEFINITIONS ==========
const routeManifest = [
  { name: "auth",         filePath: "./routes/auth",               mountPath: "/api/auth" },
  { name: "admin.auth",   filePath: "./routes/admin.auth",         mountPath: "/api/admin-auth" },
  { name: "admin",        filePath: "./routes/admin",              mountPath: "/api/admin" },
  { name: "dashboard",    filePath: "./routes/dashboard",          mountPath: "/api/dashboard" },
  { name: "client",       filePath: "./routes/client",             mountPath: "/api" },
  { name: "location",     filePath: "./routes/location",           mountPath: "/api" },
  { name: "report",       filePath: "./routes/report",             mountPath: "/api" },
  { name: "feedback",     filePath: "./routes/feedback.routes",    mountPath: "/api/feedback" },
  { name: "config",       filePath: "./routes/config",             mountPath: "/api/config" },
  { name: "inspections",  filePath: "./routes/inspection",         mountPath: "/api/inspections" },
  { name: "notification", filePath: "./routes/notification.routes",mountPath: "/api/notifications" },
  { name: "certification",filePath: "./routes/certification",      mountPath: "/api" },
  { name: "auditlogs",    filePath: "./routes/auditLog",           mountPath: "/api/auditlogs" },
  { name: "microsoft",    filePath: "./routes/microsoft",          mountPath: "/api/microsoft" },
]; 

// ========== LOAD ROUTES ==========
const loadRoutes = () => {
  routeManifest.forEach(({ name, filePath, mountPath }) => {
    try {
      const router = require(filePath);
      app.use(mountPath, router);
      console.log(`✅ [route] ${name.padEnd(15)} → ${mountPath}`);
    } catch (err) {
      console.error(`❌ [route] Failed to load "${name}": ${err.message}`);
    }
  });
};

// ========== SYSTEM ROUTES ==========
app.get("/", (req, res) => {
  res.json({
    message: "HSE Backend API",
    status: "running",
    version: "1.0.0",
    environment: NODE_ENV,
  });
});

app.get("/api/health", (req, res) => {
  res.json({
    status: "OK",
    mongodb: mongoose.connection.readyState === 1 ? "connected" : "disconnected",
    uptime: `${Math.floor(process.uptime())}s`,
    timestamp: new Date().toISOString(),
    environment: NODE_ENV,
  });
});

// ========== DEBUG ROUTES (development only) ==========
if (NODE_ENV === "development") {
  app.get("/api/debug/routes", (req, res) => {
    const results = {};
    routeManifest.forEach(({ name, filePath }) => {
      try {
        require(filePath);
        results[name] = "✅ OK";
      } catch (err) {
        results[name] = `❌ ${err.message}`;
      }
    });
    res.json(results);
  });

  app.get("/api/debug/microsoft-config", (req, res) => {
    res.json({
      tenantId:     process.env.MICROSOFT_TENANT_ID     ? "✅ Set" : "❌ Missing",
      clientId:     process.env.MICROSOFT_CLIENT_ID     ? "✅ Set" : "❌ Missing",
      clientSecret: process.env.MICROSOFT_CLIENT_SECRET ? "✅ Set" : "❌ Missing",
    });
  });
}

// ========== 404 HANDLER ==========
app.use((req, res) => {
  res.status(404).json({
    error: "Route not found",
    method: req.method,
    path: req.url,
    hint: "See GET /api/health for server status",
  });
});

// ========== GLOBAL ERROR HANDLER ==========
app.use((err, req, res, next) => {
  console.error("❌ Unhandled error:", err.stack || err.message);

  if (err.message === "Not allowed by CORS") {
    return res.status(403).json({ error: "CORS: origin not allowed" });
  }

  res.status(err.status || 500).json({
    error: err.message || "Internal server error",
    ...(NODE_ENV === "development" && { stack: err.stack }),
  });
});

// ========== BOOTSTRAP ==========
const bootstrap = async () => {
  await connectDB();
  loadRoutes();

  const server = app.listen(PORT, () => {
    console.log("\n🚀 HSE Backend started");
    console.log(`   Port        : ${PORT}`);
    console.log(`   Environment : ${NODE_ENV}`);
    console.log(`   MongoDB     : ${mongoose.connection.readyState === 1 ? "connected" : "disconnected"}`);
    console.log(`   Origins     : ${allowedOrigins.join(", ")}\n`);
  });

  // ========== GRACEFUL SHUTDOWN ==========
  const shutdown = (signal) => {
    console.log(`\n${signal} received — shutting down gracefully...`);
    server.close(async () => {
      await mongoose.connection.close();
      console.log("✅ Server and DB closed cleanly");
      process.exit(0);
    });
  };

  process.on("SIGTERM", () => shutdown("SIGTERM"));
  process.on("SIGINT",  () => shutdown("SIGINT"));
};

bootstrap();