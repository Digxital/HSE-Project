const RiskLevel = require("../../model/riskLevel.model");

exports.createRiskLevel = async (req, res) => {
    const { name, severity, description, color } = req.body;

    if (!name || !name.trim()) {
        return res.status(400).json({
            success: false,
            message: "Name is required",
            data: {}
        });
    }

    if (severity === undefined || severity === null) {
        return res.status(400).json({
            success: false,
            message: "Severity is required",
            data: {}
        });
    }

    try {
        const riskLevel = await RiskLevel.create({
            name: name.trim(),
            severity,
            description,
            color
        });

        return res.status(201).json({
            success: true,
            message: "Risk level created",
            data: riskLevel
        });
    } catch (err) {
        if (err && err.code === 11000) {
            return res.status(409).json({
                success: false,
                message: "Risk level already exists",
                data: {}
            });
        }

        return res.status(500).json({
            success: false,
            message: "Failed to create risk level",
            data: {}
        });
    }
};

exports.getRiskLevels = async (req, res) => {
    const levels = await RiskLevel.find().sort({ severity: 1 });

    return res.json({
        success: true,
        message: "Risk levels fetched",
        data: levels
    });
};

exports.updateRiskLevel = async (req, res) => {
    const { name, severity, description, color } = req.body;

    if (name !== undefined && !name.trim()) {
        return res.status(400).json({
            success: false,
            message: "Name cannot be empty",
            data: {}
        });
    }

    try {
        const riskLevel = await RiskLevel.findByIdAndUpdate(
            req.params.id,
            {
                ...(name !== undefined ? { name: name.trim() } : {}),
                ...(severity !== undefined ? { severity } : {}),
                ...(description !== undefined ? { description } : {}),
                ...(color !== undefined ? { color } : {})
            },
            { new: true, runValidators: true }
        );

        if (!riskLevel) {
            return res.status(404).json({
                success: false,
                message: "Risk level not found",
                data: {}
            });
        }

        return res.json({
            success: true,
            message: "Risk level updated",
            data: riskLevel
        });
    } catch (err) {
        if (err && err.code === 11000) {
            return res.status(409).json({
                success: false,
                message: "Risk level already exists",
                data: {}
            });
        }

        return res.status(500).json({
            success: false,
            message: "Failed to update risk level",
            data: {}
        });
    }
};

exports.deleteRiskLevel = async (req, res) => {
    const riskLevel = await RiskLevel.findByIdAndDelete(req.params.id);

    if (!riskLevel) {
        return res.status(404).json({
            success: false,
            message: "Risk level not found",
            data: {}
        });
    }

    return res.json({
        success: true,
        message: "Risk level deleted",
        data: {}
    });
};
