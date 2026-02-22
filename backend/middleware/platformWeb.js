module.exports = (req, res, next) => {
    const platform = req.headers["x-platform"];

    if (platform !== "web") {
        return res.status(403).json({
            success: false,
            message: "Platform not allowed",
            data: {}
        });
    }

    next();
};
