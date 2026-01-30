module.exports = (roles, platforms) => {
    return (req, res, next) => {
        const platform = req.headers["x-platform"];

        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ message: "Access denied" });
        }

        if (!platforms.includes(platform)) {
            return res.status(403).json({ message: "Platform not allowed" });
        }

        next();
    };
};
