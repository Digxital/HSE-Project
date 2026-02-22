require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

// ========== CORS CONFIGURATION - MUST BE FIRST ==========
const allowedOrigins = [
  // Local development
  'http://localhost:5173',
  'http://localhost:5174',
  'http://localhost:5175',
  'http://localhost:5000',
  'http://127.0.0.1:5173',
  'http://127.0.0.1:5174',
  'http://127.0.0.1:5175',
  'http://127.0.0.1:5000',
  // Production frontend (Vercel) 
  'https://hse-frontend-eight.vercel.app',
   
  // Environment variable for flexibility
  process.env.FRONTEND_URL,
  
  // Remove this line - it's your backend URL, not frontend
  // 'https://hse-backend-production.up.railway.app'
].filter(Boolean);

// CORS middleware - MUST BE FIRST
app.use(cors({
  origin: function(origin, callback) {
    // Allow requests with no origin (like mobile apps, curl, etc)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      console.log('🚫 Blocked origin:', origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With','x-platform'],
  exposedHeaders: ['Content-Range', 'X-Content-Range']
}));

// ========== OTHER MIDDLEWARE ==========
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// Request logging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  console.log('Origin:', req.headers.origin);
  console.log('CORS headers:', res.getHeaders()['access-control-allow-origin']);
  next();
});

// ========== TEST ROUTE TO VERIFY CORS ==========
app.get('/test-cors', (req, res) => {
  res.json({ 
    message: 'CORS is working!',
    origin: req.headers.origin 
  });
});

// ========== ROUTES ==========
// Microsoft routes
// app.use('/api/microsoft', require('./routes/microsoft')); 
// app.use('/api/microsoft/users', require('./routes/microsoft.users')); 

// ========== MICROSOFT ROUTES ==========
// Combined Microsoft routes (SKUs, token, and user management)
app.use('/api/microsoft', require('./routes/microsoft'));

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
      dashboard: "/api/dashboard",
      microsoft: "/api/microsoft" 
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

// Add this temporary debug route to index.js
app.get('/api/debug/microsoft-config', (req, res) => {
  res.json({
    tenantId: process.env.MICROSOFT_TENANT_ID ? '✅ Set' : '❌ Missing',
    clientId: process.env.MICROSOFT_CLIENT_ID ? '✅ Set' : '❌ Missing',
    clientSecret: process.env.MICROSOFT_CLIENT_SECRET ? '✅ Set' : '❌ Missing',
    // Show first few characters of secret (safely)
    clientSecretPreview: process.env.MICROSOFT_CLIENT_SECRET ? 
      `${process.env.MICROSOFT_CLIENT_SECRET.substring(0, 5)}...` : 'N/A'
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
    
    await mongoose.connect(mongoURI);
    console.log("✅ MongoDB connected successfully");
  } catch (err) {
    console.error("❌ MongoDB connection failed:", err.message);
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
      console.warn(`⚠️ Could not load ${name} routes: ${error.message}`);
      
      const placeholderRouter = express.Router();
      
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
app.use((req, res) => {
  res.status(404).json({
    error: "Route not found",
    path: req.url,
    method: req.method,
    suggestion: "Check available routes at GET /api"
  });
});

app.use((err, req, res, next) => {
  console.error("❌ Server error:", err.stack || err.message);
  
  // Handle CORS errors specifically
  if (err.message === 'Not allowed by CORS') {
    return res.status(403).json({
      error: 'CORS error: Origin not allowed',
      origin: req.headers.origin
    });
  }
  
  res.status(500).json({
    error: err.message || "Internal server error",
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
  console.log('✅ Allowed origins:', allowedOrigins);
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