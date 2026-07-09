const express = require("express");
const router = express.Router();

const superAdminAuth = require("../middleware/superAdminAuth");
const validateObjectId = require("../middleware/validateObjectId");
const handleProfilePicUpload = require("../middleware/handleProfilePicUpload");
const {
    superAdminRegister,
    superAdminLogin,
    getSuperAdminProfile,
    updateSuperAdminProfile
} = require("../controller/superAdmin.auth.controller");
const {
    getSuperAdminNotifications,
    markSuperAdminNotificationAsRead
} = require("../controller/notification.controller");

router.post("/register", superAdminRegister);
router.post("/login", superAdminLogin);

router.get("/profile", superAdminAuth, getSuperAdminProfile);
router.put("/profile", superAdminAuth, handleProfilePicUpload, updateSuperAdminProfile);
router.get("/notifications", superAdminAuth, getSuperAdminNotifications);
router.patch(
    "/notifications/:id/read",
    superAdminAuth,
    validateObjectId,
    markSuperAdminNotificationAsRead
);

module.exports = router;
