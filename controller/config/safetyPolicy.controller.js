const SafetyPolicy = require("../../model/safetyPolicy.model");

exports.createSafetyPolicy = async (req, res) => {
    const { title, content, version, effectiveDate } = req.body;

    if (!title || !title.trim()) {
        return res.status(400).json({
            success: false,
            message: "Title is required",
            data: {}
        });
    }

    if (!content || !content.trim()) {
        return res.status(400).json({
            success: false,
            message: "Content is required",
            data: {}
        });
    }

    try {
        const safetyPolicy = await SafetyPolicy.create({
            title: title.trim(),
            content: content.trim(),
            version,
            effectiveDate
        });

        return res.status(201).json({
            success: true,
            message: "Safety policy created",
            data: safetyPolicy
        });
    } catch (err) {
        if (err && err.code === 11000) {
            return res.status(409).json({
                success: false,
                message: "Safety policy already exists",
                data: {}
            });
        }

        return res.status(500).json({
            success: false,
            message: "Failed to create safety policy",
            data: {}
        });
    }
};

exports.getSafetyPolicies = async (req, res) => {
    const policies = await SafetyPolicy.find().sort({ title: 1 });

    return res.json({
        success: true,
        message: "Safety policies fetched",
        data: policies
    });
};

exports.updateSafetyPolicy = async (req, res) => {
    const { title, content, version, effectiveDate } = req.body;

    if (title !== undefined && !title.trim()) {
        return res.status(400).json({
            success: false,
            message: "Title cannot be empty",
            data: {}
        });
    }

    if (content !== undefined && !content.trim()) {
        return res.status(400).json({
            success: false,
            message: "Content cannot be empty",
            data: {}
        });
    }

    try {
        const safetyPolicy = await SafetyPolicy.findByIdAndUpdate(
            req.params.id,
            {
                ...(title !== undefined ? { title: title.trim() } : {}),
                ...(content !== undefined ? { content: content.trim() } : {}),
                ...(version !== undefined ? { version } : {}),
                ...(effectiveDate !== undefined ? { effectiveDate } : {})
            },
            { new: true, runValidators: true }
        );

        if (!safetyPolicy) {
            return res.status(404).json({
                success: false,
                message: "Safety policy not found",
                data: {}
            });
        }

        return res.json({
            success: true,
            message: "Safety policy updated",
            data: safetyPolicy
        });
    } catch (err) {
        if (err && err.code === 11000) {
            return res.status(409).json({
                success: false,
                message: "Safety policy already exists",
                data: {}
            });
        }

        return res.status(500).json({
            success: false,
            message: "Failed to update safety policy",
            data: {}
        });
    }
};

exports.deleteSafetyPolicy = async (req, res) => {
    const safetyPolicy = await SafetyPolicy.findByIdAndDelete(req.params.id);

    if (!safetyPolicy) {
        return res.status(404).json({
            success: false,
            message: "Safety policy not found",
            data: {}
        });
    }

    return res.json({
        success: true,
        message: "Safety policy deleted",
        data: {}
    });
};
