const Incident = require("../model/incident.model");
const RiskLevel = require("../model/riskLevel.model");

// CREATE INCIDENT (FIELD_USER only)
exports.createIncident = async (req, res) => {
    try {
        const { title, description, location, category, riskLevel } = req.body;

        if (!title || !description || !location || !category || !riskLevel) {
            return res.status(400).json({
                success: false,
                message: "All required fields must be provided",
                data: {}
            });
        }

        const risk = await RiskLevel.findById(riskLevel);
        if (!risk) {
            return res.status(404).json({
                success: false,
                message: "Risk level not found",
                data: {}
            });
        }

        let status = "OPEN";

        const history = [
            {
                action: "INCIDENT_CREATED",
                performedBy: req.user.id
            }
        ];

        if (risk.severity === 5) {
            status = "ESCALATED";
            history.push({
                action: "INCIDENT_ESCALATED",
                performedBy: req.user.id
            });
        }

        const incident = await Incident.create({
            title,
            description,
            location,
            category,
            riskLevel,
            status,
            reportedBy: req.user.id,
            history
        });

        return res.status(201).json({
            success: true,
            message: "Incident created successfully",
            data: incident
        });

    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Failed to create incident",
            data: {}
        });
    }
};

// GET INCIDENTS
exports.getIncidents = async (req, res) => {
    try {
        let filter = {};

        if (req.user.role === "FIELD_USER") {
            filter.reportedBy = req.user.id;
        }

        const incidents = await Incident.find(filter)
            .populate("category riskLevel reportedBy assignedTo")
            .sort({ createdAt: -1 });

        return res.json({
            success: true,
            message: "Incidents fetched",
            data: incidents
        });

    } catch {
        return res.status(500).json({
            success: false,
            message: "Failed to fetch incidents",
            data: {}
        });
    }
};

// ASSIGN INCIDENT (SUPERVISOR + ADMIN)
exports.assignIncident = async (req, res) => {
    try {
        const { assignedTo } = req.body;

        const incident = await Incident.findById(req.params.id);
        if (!incident) {
            return res.status(404).json({
                success: false,
                message: "Incident not found",
                data: {}
            });
        }

        incident.assignedTo = assignedTo;
        incident.history.push({
            action: "INCIDENT_ASSIGNED",
            performedBy: req.user.id
        });

        await incident.save();

        return res.json({
            success: true,
            message: "Incident assigned",
            data: incident
        });

    } catch {
        return res.status(500).json({
            success: false,
            message: "Assignment failed",
            data: {}
        });
    }
};

// UPDATE STATUS (SUPERVISOR + ADMIN)
exports.updateStatus = async (req, res) => {
    try {
        const { status } = req.body;

        const allowedStatuses = [
            "OPEN",
            "IN_PROGRESS",
            "RESOLVED",
            "CLOSED",
            "ESCALATED"
        ];

        if (!allowedStatuses.includes(status)) {
            return res.status(400).json({
                success: false,
                message: "Invalid status value",
                data: {}
            });
        }

        const incident = await Incident.findById(req.params.id);
        if (!incident) {
            return res.status(404).json({
                success: false,
                message: "Incident not found",
                data: {}
            });
        }

        incident.status = status;
        incident.history.push({
            action: "STATUS_UPDATED",
            performedBy: req.user.id
        });

        await incident.save();

        return res.json({
            success: true,
            message: "Status updated",
            data: incident
        });

    } catch {
        return res.status(500).json({
            success: false,
            message: "Status update failed",
            data: {}
        });
    }
};

// UPLOAD ATTACHMENT
exports.uploadAttachment = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "File is required",
                data: {}
            });
        }

        const incident = await Incident.findById(req.params.id);
        if (!incident) {
            return res.status(404).json({
                success: false,
                message: "Incident not found",
                data: {}
            });
        }

        incident.attachments.push(req.file.path);
        incident.history.push({
            action: "ATTACHMENT_ADDED",
            performedBy: req.user.id
        });

        await incident.save();

        return res.json({
            success: true,
            message: "Attachment uploaded",
            data: incident
        });

    } catch {
        return res.status(500).json({
            success: false,
            message: "Upload failed",
            data: {}
        });
    }
};
