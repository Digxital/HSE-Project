const InspectionTemplate = require("../../model/inspectionTemplate.model");

exports.createInspectionTemplate = async (req, res) => {
    const { name, description, items, isActive } = req.body;

    if (!name || !name.trim()) {
        return res.status(400).json({
            success: false,
            message: "Name is required",
            data: {}
        });
    }

    if (!Array.isArray(items) || items.length === 0) {
        return res.status(400).json({
            success: false,
            message: "At least one inspection item is required",
            data: {}
        });
    }

    try {
        const inspectionTemplate = await InspectionTemplate.create({
            name: name.trim(),
            description,
            items,
            isActive
        });

        return res.status(201).json({
            success: true,
            message: "Inspection template created",
            data: inspectionTemplate
        });
    } catch (err) {
        if (err && err.code === 11000) {
            return res.status(409).json({
                success: false,
                message: "Inspection template already exists",
                data: {}
            });
        }

        return res.status(500).json({
            success: false,
            message: "Failed to create inspection template",
            data: {}
        });
    }
};

exports.getInspectionTemplates = async (req, res) => {
    const templates = await InspectionTemplate.find().sort({ name: 1 });

    return res.json({
        success: true,
        message: "Inspection templates fetched",
        data: templates
    });
};

exports.updateInspectionTemplate = async (req, res) => {
    const { name, description, items, isActive } = req.body;

    if (name !== undefined && !name.trim()) {
        return res.status(400).json({
            success: false,
            message: "Name cannot be empty",
            data: {}
        });
    }

    if (items !== undefined && (!Array.isArray(items) || items.length === 0)) {
        return res.status(400).json({
            success: false,
            message: "At least one inspection item is required",
            data: {}
        });
    }

    try {
        const inspectionTemplate = await InspectionTemplate.findByIdAndUpdate(
            req.params.id,
            {
                ...(name !== undefined ? { name: name.trim() } : {}),
                ...(description !== undefined ? { description } : {}),
                ...(items !== undefined ? { items } : {}),
                ...(isActive !== undefined ? { isActive } : {})
            },
            { new: true, runValidators: true }
        );

        if (!inspectionTemplate) {
            return res.status(404).json({
                success: false,
                message: "Inspection template not found",
                data: {}
            });
        }

        return res.json({
            success: true,
            message: "Inspection template updated",
            data: inspectionTemplate
        });
    } catch (err) {
        if (err && err.code === 11000) {
            return res.status(409).json({
                success: false,
                message: "Inspection template already exists",
                data: {}
            });
        }

        return res.status(500).json({
            success: false,
            message: "Failed to update inspection template",
            data: {}
        });
    }
};

exports.deleteInspectionTemplate = async (req, res) => {
    const inspectionTemplate = await InspectionTemplate.findByIdAndDelete(
        req.params.id
    );

    if (!inspectionTemplate) {
        return res.status(404).json({
            success: false,
            message: "Inspection template not found",
            data: {}
        });
    }

    return res.json({
        success: true,
        message: "Inspection template deleted",
        data: {}
    });
};
