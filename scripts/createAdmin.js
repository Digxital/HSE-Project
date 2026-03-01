require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("../model/user.model");

(async () => {
    try {
        console.log("Connecting DB...");
        await mongoose.connect(process.env.MONGO_URI);

        const email = "admin@aegix.com";
        const password = "Admin123";

        console.log("Checking if admin exists...");
        const existingAdmin = await User.findOne({ email });

        console.log("Hashing password...");
        const passwordHash = await bcrypt.hash(password, 10);

        if (existingAdmin) {
            console.log("Admin exists. Updating credentials...");
            existingAdmin.passwordHash = passwordHash;
            existingAdmin.role = "ADMIN";
            existingAdmin.status = "ACTIVE";
            existingAdmin.firstName = "Admin";
            existingAdmin.lastName = "User";
            await existingAdmin.save();
            console.log("ADMIN UPDATED SUCCESSFULLY");
            console.log(`Email: ${email}`);
            console.log(`Password: ${password}`);
            process.exit(0);
        }

        console.log("Creating admin...");
        await User.create({
            tenantId: new mongoose.Types.ObjectId(),
            firstName: "Admin",
            lastName: "User",
            email,
            passwordHash,
            role: "ADMIN",
            status: "ACTIVE"
        });

        console.log("ADMIN CREATED SUCCESSFULLY");
        console.log(`Email: ${email}`);
        console.log(`Password: ${password}`);
        process.exit(0);

    } catch (error) {
        console.error("Error creating admin:", error.message);
        process.exit(1);
    }
})();
