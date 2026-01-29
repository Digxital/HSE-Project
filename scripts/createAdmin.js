require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("../model/user.model");

(async () => {
    try {
        console.log("Connecting DB...");
        await mongoose.connect(process.env.MONGO_URI);

        const email = "admin@aegix.com";

        console.log("Checking if admin exists...");
        const existingAdmin = await User.findOne({ email });

        if (existingAdmin) {
            console.log("User already exists. Skipping creation.");
            process.exit(0);
        }

        console.log("Hashing password...");
        const passwordHash = await bcrypt.hash("Admin123", 10);

        console.log("Creating admin...");
        await User.create({
            tenantId: new mongoose.Types.ObjectId(),
            firstName: "Admin",
            lastName: "User",
            email,
            passwordHash,
            role: "ADMIN",
        });

        console.log("ADMIN CREATED SUCCESSFULLY");
        process.exit(0);

    } catch (error) {
        console.error("Error creating admin:", error.message);
        process.exit(1);
    }
})();
