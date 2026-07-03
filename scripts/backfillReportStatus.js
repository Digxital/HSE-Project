require("dotenv").config();
const mongoose = require("mongoose");
const Report = require("../model/report.model");

(async () => {
    try {
        console.log("Connecting DB...");
        await mongoose.connect(process.env.MONGO_URI);

        const filter = {
            status: "open",
            $or: [
                { "comments.0": { $exists: true } },
                { "adminComment.0": { $exists: true } },
                { "adminComment.text": { $exists: true } }
            ]
        };

        const result = await Report.updateMany(filter, {
            $set: { status: "in_progress" }
        });

        console.log("Backfill complete");
        console.log("Matched:", result.matchedCount ?? result.n);
        console.log("Modified:", result.modifiedCount ?? result.nModified);
        process.exit(0);
    } catch (error) {
        console.error("Backfill failed:", error.message);
        process.exit(1);
    }
})();
