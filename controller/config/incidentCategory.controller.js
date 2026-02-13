const IncidentCategory = require("../../model/incidentCategory.model");

exports.createIncidentCategory = async (req, res) => {
    const { name, description, isActive } = req.body;

    if (!name || !name.trim()) {
        return res.status(400).json({
            success: false,
            message: "Name is required",
            data: {}
        });
    }

    try {
        const incidentCategory = await IncidentCategory.create({
            name: name.trim(),
            description,
            isActive
        });

        return res.status(201).json({
            success: true,
            message: "Incident category created",
            data: incidentCategory
        });
    } catch (err) {
        if (err && err.code === 11000) {
            return res.status(409).json({
                success: false,
                message: "Incident category already exists",
                data: {}
            });
        }

        return res.status(500).json({
            success: false,
            message: "Failed to create incident category",
            data: {}
        });
    }
};

exports.getIncidentCategories = async (req, res) => {
    const categories = await IncidentCategory.find().sort({ name: 1 });

    return res.json({
        success: true,
        message: "Incident categories fetched",
        data: categories
    });
};

exports.updateIncidentCategory = async (req, res) => {
    const { name, description, isActive } = req.body;

    if (name && !name.trim()) {
        return res.status(400).json({
            success: false,
            message: "Name cannot be empty",
            data: {}
        });
    }

    try {
        const incidentCategory = await IncidentCategory.findByIdAndUpdate(
            req.params.id,
            {
                ...(name !== undefined ? { name: name.trim() } : {}),
                ...(description !== undefined ? { description } : {}),
                ...(isActive !== undefined ? { isActive } : {})
            },
            { new: true, runValidators: true }
        );

        if (!incidentCategory) {
            return res.status(404).json({
                success: false,
                message: "Incident category not found",
                data: {}
            });
        }

        return res.json({
            success: true,
            message: "Incident category updated",
            data: incidentCategory
        });
    } catch (err) {
        if (err && err.code === 11000) {
            return res.status(409).json({
                success: false,
                message: "Incident category already exists",
                data: {}
            });
        }

        return res.status(500).json({
            success: false,
            message: "Failed to update incident category",
            data: {}
        });
    }
};

exports.deleteIncidentCategory = async (req, res) => {
    const incidentCategory = await IncidentCategory.findByIdAndDelete(
        req.params.id
    );

    if (!incidentCategory) {
        return res.status(404).json({
            success: false,
            message: "Incident category not found",
            data: {}
        });
    }

    return res.json({
        success: true,
        message: "Incident category deleted",
        data: {}
    });
};
