require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");

const authRoutes = require("./routes/auth");
const adminRoutes = require("./routes/admin");
const dashboardRoutes = require("./routes/dashboard");


const app = express();
app.use(express.json());

mongoose
    .connect(process.env.MONGO_URI)
    .then(() => console.log("MongoDB connected"))
    .catch(err => console.log("MongoDB error:", err.message));

app.use("/auth", authRoutes);
app.use("/admin", adminRoutes);
app.use("/", dashboardRoutes);


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log("Server running on port", PORT);
});
