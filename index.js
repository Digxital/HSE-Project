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
const configRoutes = require("./routes/config");
const incidentRoutes = require("./routes/incident")
const inspectionRoutes = require("./routes/inspection");



const app = express();
app.use(express.json());

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
app.use("/api/config", configRoutes);
app.use("/api/incidents", incidentRoutes);
app.use("/uploads", express.static("uploads"));
app.use("/api/inspections", inspectionRoutes);


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log("Server running on port", PORT);
});
