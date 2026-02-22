const Inspection = require("../model/inspection.model");
const User = require("../model/user.model");

// CREATE INSPECTION (Web - Supervisor/Admin)
exports.createInspection = async (req, res) => {
    try {
        const { title, location, scheduledDate } = req.body;

        const inspection = await Inspection.create({
            title,
            location,
            scheduledDate,
            createdBy: req.user.id
        });

        return res.status(201).json({
            success: true,
            message: "Inspection created successfully",
            data: inspection
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
            data: {}
        });
    }
};

// ASSIGN INSPECTOR (Web)
exports.assignInspector = async (req, res) => {
    try {
        const { assignedTo } = req.body;

        const user = await User.findById(assignedTo);
        if (!user || !["SUPERVISOR", "FIELD_USER"].includes(user.role)) {
            return res.status(400).json({
                success: false,
                message: "Invalid inspector role",
                data: {}
            });
        }

        const inspection = await Inspection.findById(req.params.id);
        if (!inspection) {
            return res.status(404).json({
                success: false,
                message: "Inspection not found",
                data: {}
            });
        }

        inspection.assignedTo = assignedTo;
        inspection.status = "IN_PROGRESS";
        await inspection.save();

        return res.json({
            success: true,
            message: "Inspector assigned successfully",
            data: inspection
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
            data: {}
        });
    }
};

// SUBMIT RESULTS (Mobile - Assigned User Only)
exports.submitInspection = async (req, res) => {
    try {
        const inspection = await Inspection.findById(req.params.id);

        if (!inspection) {
            return res.status(404).json({
                success: false,
                message: "Inspection not found",
                data: {}
            });
        }

        if (!inspection.assignedTo ||
            inspection.assignedTo.toString() !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: "Not authorized to submit this inspection",
                data: {}
            });
        }

        const { results } = req.body;

        inspection.results = results;

        const hasNonCompliance = results.some(r => r.compliant === false);

        inspection.status = hasNonCompliance
            ? "NON_COMPLIANT"
            : "COMPLETED";

        await inspection.save();

        return res.json({
            success: true,
            message: "Inspection submitted successfully",
            data: inspection
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
            data: {}
        });
    }
};

// GET INSPECTIONS
exports.getInspections = async (req, res) => {
    try {
        let inspections;

        if (req.user.role === "FIELD_USER") {
            inspections = await Inspection.find({
                assignedTo: req.user.id
            });
        } else {
            inspections = await Inspection.find();
        }

        return res.json({
            success: true,
            message: "Inspections fetched successfully",
            data: inspections
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
            data: {}
        });
    }
};