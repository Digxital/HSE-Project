const jwt = require("jsonwebtoken");
const SuperAdmin = require("../model/superAdmin.model");

module.exports = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
        return res.status(401).json({
            success: false,
            message: "No token provided",
            data: {}
        });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if (decoded.role !== "SUPERADMIN") {
            return res.status(403).json({
                success: false,
                message: "Super admin access required",
                data: {}
            });
        }

        const superAdmin = await SuperAdmin.findById(decoded.id);

        if (!superAdmin || superAdmin.status !== "ACTIVE") {
            return res.status(401).json({
                success: false,
                message: "Super admin account is not active",
                data: {}
            });
        }

        req.superAdmin = {
            id: superAdmin._id,
            email: superAdmin.email,
            role: superAdmin.role
        };

        next();
    } catch {
        return res.status(401).json({
            success: false,
            message: "Invalid token",
            data: {}
        });
    }
};
