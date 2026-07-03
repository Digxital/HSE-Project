const Inspection = require("../model/inspection.model");
const User = require("../model/user.model");
const Notification = require("../model/notification.model");
const {
    buildInspectionScopeFilter,
    inspectionBelongsToTenant
} = require("../utils/tenantScope");

// CREATE INSPECTION (Web - Supervisor/Admin)
exports.createInspection = async (req, res) => {
    try {
        const { title, location, scheduledDate } = req.body;

        const inspection = await Inspection.create({
            tenantId: req.user.tenantId,
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

        const user = await User.findOne({
            _id: assignedTo,
            tenantId: req.user.tenantId
        });
        if (!user || !["SUPERVISOR", "FIELD_USER", "HSE_OFFICER"].includes(user.role)) {
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

        if (!(await inspectionBelongsToTenant(inspection, req.user.tenantId))) {
            return res.status(404).json({
                success: false,
                message: "Inspection not found",
                data: {}
            });
        }

        inspection.assignedTo = assignedTo;
        inspection.status = "IN_PROGRESS";
        await inspection.save();

        // Send notification to the assigned inspector
        try {
            console.log(`[INSPECTION NOTIFICATION] Assigning inspection to user: ${assignedTo}`);
            const notif = await Notification.create({
                user: assignedTo,
                type: "inspection_assigned",
                title: `Inspection Assigned: ${inspection.title}`,
                description: `You have been assigned inspection "${inspection.title}" at location ${inspection.location}. Scheduled date: ${inspection.scheduledDate ? new Date(inspection.scheduledDate).toLocaleDateString() : 'Not specified'}`,
                data: {
                    inspectionId: inspection._id,
                    inspectionTitle: inspection.title,
                    location: inspection.location,
                    scheduledDate: inspection.scheduledDate,
                    assignedBy: req.user.id
                }
            });
            console.log(`[INSPECTION NOTIFICATION] ✓ Notification created: ${notif._id}`);
        } catch (notificationError) {
            // Log but don't fail the request if notification creation fails
            console.error(`[INSPECTION NOTIFICATION] ✗ Error:`, notificationError.message);
        }

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

        if (!(await inspectionBelongsToTenant(inspection, req.user.tenantId))) {
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
        const filter = await buildInspectionScopeFilter({
            tenantId: req.user.tenantId,
            role: req.user.role,
            userId: req.user.id
        });

        const inspections = await Inspection.find(filter);

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