require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");

const authRoutes = require("./routes/auth");
const adminRoutes = require("./routes/admin");
const dashboardRoutes = require("./routes/dashboard");
const adminAuthRoutes = require("./routes/admin.auth");
const clientRoutes = require("./routes/client");
const locationRoutes = require("./routes/location");
const reportRoutes = require("./routes/report");



const app = express();
app.use(express.json());

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({
    status: "OK",
    message: "Server is running",
    mongodb: mongoose.connection.readyState === 1 ? "Connected" : "Disconnected",
    timestamp: new Date().toISOString()
  });
});

// Test routes - add these BEFORE your other routes
app.get("/", (req, res) => {
  res.json({
    message: "HSE Backend API",
    status: "running",
    endpoints: {
      health: "/api/health",
      auth: "/api/auth",
      admin: "/api/admin"
    }
  });
});

mongoose
    .connect(process.env.MONGO_URI)
    .then(() => console.log("MongoDB connected"))
    .catch(err => console.log("MongoDB error:", err.message));



app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/admin", adminAuthRoutes);
app.use("/api", dashboardRoutes);
app.use("/api", clientRoutes);
app.use("/api", locationRoutes);
app.use("/api", reportRoutes);


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log("Server running on port", PORT);
});
