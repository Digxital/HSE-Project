module.exports = (roles = [], platforms = null) => {
    return (req, res, next) => {
        const platform = req.headers["x-platform"];

        // Check role
        if (!req.user || !roles.includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                message: "Access denied",
                data: {}
            });
        }

        // Only check platform if platforms were provided
        if (platforms && !platforms.includes(platform)) {
            return res.status(403).json({
                success: false,
                message: "Platform not allowed",
                data: {}
            });
        }

        next();
    };
};
