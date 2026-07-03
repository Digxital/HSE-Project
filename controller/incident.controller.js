const Incident = require("../model/incident.model");
const RiskLevel = require("../model/riskLevel.model");
const Notification = require("../model/notification.model");
const User = require("../model/user.model");
const { notifyUser, notifyMany } = require("../utils/notify");
const { extractFileMetadata, getFileUrl, deleteFile } = require("../utils/fileHandler");

// CREATE INCIDENT (FIELD_USER only)
exports.createIncident = async (req, res) => {
    try {
        const { title, description, location, category, riskLevel } = req.body;
        // ── Validation ──────────────────────────────────────────────────────
        const missing = [];
        if (!title) missing.push("title");
        if (!description) missing.push("description");
        if (!location) missing.push("location");
        if (!category) missing.push("category");
        if (!riskLevel) missing.push("riskLevel");

        if (missing.length) {
            return res.status(400).json({
                success: false,
                message: `Missing required fields: ${missing.join(", ")}`,
                data: null,
            });
        }

        // ── Risk level check ────────────────────────────────────────────────
        const risk = await RiskLevel.findById(riskLevel);
        if (!risk) {
            return res.status(404).json({
                success: false,
                message: "Risk level not found",
                data: null,
            });
        }

        // ── Determine status ────────────────────────────────────────────────
        const isEscalated = risk.severity === 5;
        const status = isEscalated ? "ESCALATED" : "OPEN";

        const history = [{ action: "INCIDENT_CREATED", performedBy: req.user.id }];
        if (isEscalated) {
            history.push({ action: "INCIDENT_ESCALATED", performedBy: req.user.id });
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

        // ── Notify supervisors + admins if escalated ────────────────────────
        if (isEscalated) {
            const supervisors = await User.find({
                role: { $in: ["ADMIN", "SUPERVISOR", "HSE_OFFICER"] },
                status: "ACTIVE",
            }).select("_id").lean();

            if (supervisors.length) {
                const supervisorIds = supervisors.map((u) => u._id.toString());

                notifyMany({
                    userIds: supervisorIds,
                    type: "incident_assigned",
                    title: "🚨 Critical Incident Escalated",
                    description: `A severity-5 incident "${title}" has been automatically escalated and requires immediate attention.`,
                    data: {
                        incidentId: incident._id.toString(),
                        incidentTitle: title,
                        location,
                        status: "ESCALATED",
                        reportedBy: req.user.id,
                    },
                }).catch((err) =>
                    console.error("[INCIDENT] Escalation notify failed:", err.message)
                );
            }
        }

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
        const {
            status,
            page = 1,
            limit = 20,
        } = req.query;

        const pageNum = Math.max(1, parseInt(page));
        const limitNum = Math.min(100, Math.max(1, parseInt(limit)));
        const skip = (pageNum - 1) * limitNum;

        let filter = {};

        if (req.user.role === "FIELD_USER") {
            filter.reportedBy = req.user.id;
        }

        if (status) {
            if (!ALLOWED_STATUSES.includes(status)) {
                return res.status(400).json({
                    success: false,
                    message: `Invalid status filter. Must be one of: ${ALLOWED_STATUSES.join(", ")}`,
                    data: null,
                });
            }
            filter.status = status;
        }

        // ── Query ────────────────────────────────────────────────────────────
        const [incidents, total] = await Promise.all([
            Incident.find(filter)
                .populate("category", "name")
                .populate("riskLevel", "label severity color")
                .populate("reportedBy", "firstName lastName email role")
                .populate("assignedTo", "firstName lastName email role")
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limitNum)
                .lean(),
            Incident.countDocuments(filter),
        ]);

        return res.status(200).json({
            success: true,
            message: "Incidents fetched successfully",
            data: incidents,
            meta: {
                total,
                page: pageNum,
                limit: limitNum,
                totalPages: Math.ceil(total / limitNum),
                hasNextPage: pageNum < Math.ceil(total / limitNum),
            },
        });

    } catch {
        console.error("getIncidents error:", err);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch incidents",
            data: null,
        });
    }
};

// ASSIGN INCIDENT (SUPERVISOR + ADMIN)

exports.assignIncident = async (req, res) => {
    try {
        const { assignedTo } = req.body;

        if (!assignedTo) {
            return res.status(400).json({
                success: false,
                message: "assignedTo (userId) is required",
                data: null,
            });
        }

        // ── Verify target user exists ───────────────────────────────────────
        const targetUser = await User.findById(assignedTo)
            .select("firstName lastName email status")
            .lean();

        if (!targetUser) {
            return res.status(404).json({
                success: false,
                message: "Assigned user not found",
                data: null,
            });
        }

        if (targetUser.status !== "ACTIVE") {
            return res.status(400).json({
                success: false,
                message: "Cannot assign incident to an inactive user",
                data: null,
            });
        }

        // ── Fetch & update incident ─────────────────────────────────────────
        const incident = await Incident.findById(req.params.id);
        if (!incident) {
            return res.status(404).json({
                success: false,
                message: "Incident not found",
                data: null,
            });
        }

        const previousAssignee = incident.assignedTo?.toString();
        const isReassignment =
            previousAssignee && previousAssignee !== assignedTo;

        incident.assignedTo = assignedTo;
        incident.history.push({
            action: "INCIDENT_ASSIGNED",
            performedBy: req.user.id,
        });

        await incident.save();

        // ── Notify new assignee ─────────────────────────────────────────────
        notifyUser({
            userId: assignedTo,
            type: "incident_assigned",
            title: isReassignment
                ? `Incident Reassigned: ${incident.title}`
                : `Incident Assigned: ${incident.title}`,
            description: isReassignment
                ? `You have been reassigned to the incident "${incident.title}" at ${incident.location}.`
                : `You have been assigned to the incident "${incident.title}" at ${incident.location}. Please review and take action.`,
            data: {
                incidentId: incident._id.toString(),
                incidentTitle: incident.title,
                location: incident.location,
                status: incident.status,
                assignedBy: req.user.id,
            },
        }).catch((err) =>
            console.error("[INCIDENT] assignee notify failed:", err.message)
        );

        // ── Notify previous assignee if reassigned ──────────────────────────
        if (isReassignment) {
            notifyUser({
                userId: previousAssignee,
                type: "incident_assigned",
                title: `Incident Unassigned: ${incident.title}`,
                description: `You have been unassigned from the incident "${incident.title}". It has been reassigned to another team member.`,
                data: {
                    incidentId: incident._id.toString(),
                    incidentTitle: incident.title,
                },
            }).catch((err) =>
                console.error("[INCIDENT] previous assignee notify failed:", err.message)
            );
        }

        // ── Populate for response ───────────────────────────────────────────
        const populated = await Incident.findById(incident._id)
            .populate("category", "name")
            .populate("riskLevel", "label severity color")
            .populate("reportedBy", "firstName lastName email")
            .populate("assignedTo", "firstName lastName email");

        return res.status(200).json({
            success: true,
            message: isReassignment
                ? "Incident reassigned successfully"
                : "Incident assigned successfully",
            data: populated,
        });

    } catch (err) {
        console.error("assignIncident error:", err);
        return res.status(500).json({
            success: false,
            message: "Assignment failed",
            data: null,
        });
    }
};


// UPDATE STATUS (SUPERVISOR + ADMIN)
exports.updateStatus = async (req, res) => {
    try {
        const { status } = req.body;

        if (!status) {
            return res.status(400).json({
                success: false,
                message: "status is required",
                data: null,
            });
        }

        if (!ALLOWED_STATUSES.includes(status)) {
            return res.status(400).json({
                success: false,
                message: `Invalid status. Must be one of: ${ALLOWED_STATUSES.join(", ")}`,
                data: null,
            });
        }

        const incident = await Incident.findById(req.params.id);
        if (!incident) {
            return res.status(404).json({
                success: false,
                message: "Incident not found",
                data: null,
            });
        }

        // Prevent setting same status
        if (incident.status === status) {
            return res.status(400).json({
                success: false,
                message: `Incident is already in ${STATUS_LABELS[status]} status`,
                data: null,
            });
        }

        const previousStatus = incident.status;

        incident.status = status;
        incident.history.push({
            action: "STATUS_UPDATED",
            performedBy: req.user.id,
        });

        await incident.save();

        // ── Notify reporter of status change ────────────────────────────────
        notifyUser({
            userId: incident.reportedBy.toString(),
            type: "action_progress",
            title: `Incident Status Updated: ${incident.title}`,
            description: `Your incident "${incident.title}" status has been updated from ${STATUS_LABELS[previousStatus]} to ${STATUS_LABELS[status]}.`,
            data: {
                incidentId: incident._id.toString(),
                incidentTitle: incident.title,
                previousStatus,
                newStatus: status,
            },
        }).catch((err) =>
            console.error("[INCIDENT] reporter status notify failed:", err.message)
        );

        // ── Also notify assignee if different from reporter ─────────────────
        if (
            incident.assignedTo &&
            incident.assignedTo.toString() !== incident.reportedBy.toString()
        ) {
            notifyUser({
                userId: incident.assignedTo.toString(),
                type: "action_progress",
                title: `Incident Status Updated: ${incident.title}`,
                description: `Incident "${incident.title}" you are assigned to has been updated from ${STATUS_LABELS[previousStatus]} to ${STATUS_LABELS[status]}.`,
                data: {
                    incidentId: incident._id.toString(),
                    incidentTitle: incident.title,
                    previousStatus,
                    newStatus: status,
                },
            }).catch((err) =>
                console.error("[INCIDENT] assignee status notify failed:", err.message)
            );
        }

        return res.status(200).json({
            success: true,
            message: `Incident status updated to ${STATUS_LABELS[status]}`,
            data: incident,
        });

    } catch (err) {
        console.error("updateStatus error:", err);
        return res.status(500).json({
            success: false,
            message: "Status update failed",
            data: null,
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
                data: null,
            });
        }

        const incident = await Incident.findById(req.params.id);
        if (!incident) {
            // Clean up uploaded file immediately
            deleteFile(req.file.path);
            return res.status(404).json({
                success: false,
                message: "Incident not found",
                data: null,
            });
        }

        // Field users can only upload to their own incidents
        if (
            req.user.role === "FIELD_USER" &&
            incident.reportedBy.toString() !== req.user.id
        ) {
            deleteFile(req.file.path);
            return res.status(403).json({
                success: false,
                message: "Access denied",
                data: null,
            });
        }

        const fileMetadata = extractFileMetadata(req.file);
        fileMetadata.uploadedBy = req.user.id;

        incident.attachments.push(fileMetadata);
        incident.history.push({
            action: "ATTACHMENT_ADDED",
            performedBy: req.user.id,
        });

        await incident.save();

        return res.status(200).json({
            success: true,
            message: "Attachment uploaded successfully",
            data: {
                attachment: fileMetadata,
                totalAttachments: incident.attachments.length,
            },
        });

    } catch (err) {
        console.error("uploadAttachment error:", err);
        if (req.file) deleteFile(req.file.path);
        return res.status(500).json({
            success: false,
            message: "Upload failed",
            data: null
        });
    }
};
