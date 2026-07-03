const SystemSetting = require("../../model/systemSetting.model");

exports.createSystemSetting = async (req, res) => {
    const { key, value, description, group } = req.body;

    if (!key || !key.trim()) {
        return res.status(400).json({
            success: false,
            message: "Key is required",
            data: {}
        });
    }

    if (value === undefined) {
        return res.status(400).json({
            success: false,
            message: "Value is required",
            data: {}
        });
    }

    try {
        const systemSetting = await SystemSetting.create({
            key: key.trim(),
            value,
            description,
            group
        });

        return res.status(201).json({
            success: true,
            message: "System setting created",
            data: systemSetting
        });
    } catch (err) {
        if (err && err.code === 11000) {
            return res.status(409).json({
                success: false,
                message: "System setting already exists",
                data: {}
            });
        }

        return res.status(500).json({
            success: false,
            message: "Failed to create system setting",
            data: {}
        });
    }
};

exports.getSystemSettings = async (req, res) => {
    const settings = await SystemSetting.find().sort({ key: 1 });

    return res.json({
        success: true,
        message: "System settings fetched",
        data: settings
    });
};

exports.updateSystemSetting = async (req, res) => {
    const { key, value, description, group } = req.body;

    if (key !== undefined && !key.trim()) {
        return res.status(400).json({
            success: false,
            message: "Key cannot be empty",
            data: {}
        });
    }

    try {
        const systemSetting = await SystemSetting.findByIdAndUpdate(
            req.params.id,
            {
                ...(key !== undefined ? { key: key.trim() } : {}),
                ...(value !== undefined ? { value } : {}),
                ...(description !== undefined ? { description } : {}),
                ...(group !== undefined ? { group } : {})
            },
            { new: true, runValidators: true }
        );

        if (!systemSetting) {
            return res.status(404).json({
                success: false,
                message: "System setting not found",
                data: {}
            });
        }

        return res.json({
            success: true,
            message: "System setting updated",
            data: systemSetting
        });
    } catch (err) {
        if (err && err.code === 11000) {
            return res.status(409).json({
                success: false,
                message: "System setting already exists",
                data: {}
            });
        }

        return res.status(500).json({
            success: false,
            message: "Failed to update system setting",
            data: {}
        });
    }
};

exports.deleteSystemSetting = async (req, res) => {
    const systemSetting = await SystemSetting.findByIdAndDelete(req.params.id);

    if (!systemSetting) {
        return res.status(404).json({
            success: false,
            message: "System setting not found",
            data: {}
        });
    }

    return res.json({
        success: true,
        message: "System setting deleted",
        data: {}
    });
};
