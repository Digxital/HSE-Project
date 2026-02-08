require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

// ========== MIDDLEWARE ==========
app.use(cors({
  origin: ['http://localhost:3000', process.env.FRONTEND_URL].filter(Boolean),
  credentials: true
}));

app.use(express.json());

// Request logging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// ========== BASIC ROUTES ==========
app.get("/", (req, res) => {
  res.json({
    message: "HSE Backend API",
    status: "running",
    version: "1.0.0",
    endpoints: {
      docs: "/api",
      health: "/api/health",
      auth: "/api/auth",
      admin: "/api/admin",
      dashboard: "/api/dashboard"
    }
  });
});

app.get("/api", (req, res) => {
  res.json({
    message: "API Documentation",
    baseUrl: process.env.BASE_URL || `http://localhost:${process.env.PORT || 5000}`,
    endpoints: [
      "GET    /api/health",
      "POST   /api/auth/login",
      "POST   /api/auth/register",
      "GET    /api/admin",
      "GET    /api/dashboard",
      "GET    /api/client",
      "GET    /api/location",
      "GET    /api/report"
    ]
  });
});

app.get("/api/health", (req, res) => {
  res.json({
    status: "OK",
    message: "Server is running",
    mongodb: mongoose.connection.readyState === 1 ? "Connected" : "Disconnected",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || "development"
  });
});

// ========== DATABASE CONNECTION ==========
const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGO_URI;
    
    if (!mongoURI) {
      console.warn("⚠️ MONGO_URI not set in environment variables");
      console.log("💡 Using in-memory mode (data won't persist)");
      return;
    }
    
    await mongoose.connect(mongoURI || "mongodb://localhost:27017/hse-db");
    console.log("✅ MongoDB connected successfully");
  } catch (err) {
    console.error("❌ MongoDB connection failed:", err.message);
    console.log("💡 Continuing without database connection");
  }
};

connectDB();

// ========== LOAD ROUTES ==========
const loadRoutes = () => {
  const routes = [
    { name: "auth", path: "./routes/auth", routePath: "/api/auth" },
    { name: "admin", path: "./routes/admin", routePath: "/api/admin" },
    { name: "dashboard", path: "./routes/dashboard", routePath: "/api/dashboard" },
    { name: "admin.auth", path: "./routes/admin.auth", routePath: "/api/admin/auth" },
    { name: "client", path: "./routes/client", routePath: "/api/client" },
    { name: "location", path: "./routes/location", routePath: "/api/location" },
    { name: "report", path: "./routes/report", routePath: "/api/report" }
  ];

  routes.forEach(({ name, path, routePath }) => {
    try {
      const router = require(path);
      app.use(routePath, router);
      console.log(`✅ Loaded ${name} routes at ${routePath}`);
    } catch (error) {
      console.warn(`⚠️ Could not load ${name} routes from ${path}: ${error.message}`);
      
      // Create basic placeholder route
      const placeholderRouter = express.Router();
      placeholderRouter.get("/", (req, res) => {
        res.json({
          message: `${name.toUpperCase()} API`,
          status: "Placeholder route",
          note: `Create ${path} file for actual implementation`
        });
      });
      
      // Add basic CRUD placeholders
      if (name === "auth") {
        placeholderRouter.post("/login", (req, res) => {
          const { email, password } = req.body;
          if (!email || !password) {
            return res.status(400).json({ error: "Email and password required" });
          }
          res.json({
            success: true,
            message: "Login successful (placeholder)",
            token: "dummy-jwt-token",
            user: { id: 1, email, name: "Test User" }
          });
        });
        
        placeholderRouter.post("/register", (req, res) => {
          res.json({ message: "Registration endpoint (placeholder)" });
        });
      }
      
      app.use(routePath, placeholderRouter);
    }
  });
};

loadRoutes();

// ========== ERROR HANDLING ==========

// 404 Handler - MUST BE AFTER ALL OTHER ROUTES
app.use((req, res) => {
  res.status(404).json({
    error: "Route not found",
    path: req.url,
    method: req.method,
    suggestion: "Check available routes at GET /api"
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error("❌ Server error:", err.stack || err.message);
  
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal server error";
  
  res.status(statusCode).json({
    error: message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// ========== START SERVER ==========
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📡 MongoDB: ${mongoose.connection.readyState === 1 ? '✅ Connected' : '❌ Disconnected'}`);
  console.log(`🌐 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔗 Base URL: http://localhost:${PORT}`);
});

// ========== GRACEFUL SHUTDOWN ==========
process.on('SIGTERM', () => {
  console.log('SIGTERM received. Closing server gracefully...');
  server.close(() => {
    console.log('Server closed');
    mongoose.connection.close(false, () => {
      console.log('MongoDB connection closed');
      process.exit(0);
    });
  });
});

process.on('SIGINT', () => {
  console.log('SIGINT received. Closing server...');
  server.close(() => {
    process.exit(0);
  });
});