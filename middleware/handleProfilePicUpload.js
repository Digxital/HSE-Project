const { uploadProfilePic } = require("../utils/multer");

module.exports = (req, res, next) => {
    const contentType = req.headers["content-type"] || "";

    if (!contentType.includes("multipart/form-data")) {
        return next();
    }

    uploadProfilePic.single("profilePic")(req, res, (err) => {
        if (err) {
            return res.status(400).json({
                success: false,
                message: err.message || "Invalid profile picture upload",
                data: {}
            });
        }

        next();
    });
};
