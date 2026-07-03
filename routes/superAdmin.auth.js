const express = require("express");
const router = express.Router();

const superAdminAuth = require("../middleware/superAdminAuth");
const handleProfilePicUpload = require("../middleware/handleProfilePicUpload");
const {
    superAdminRegister,
    superAdminLogin,
    getSuperAdminProfile,
    updateSuperAdminProfile
} = require("../controller/superAdmin.auth.controller");

router.post("/register", superAdminRegister);
router.post("/login", superAdminLogin);

router.get("/profile", superAdminAuth, getSuperAdminProfile);
router.put("/profile", superAdminAuth, handleProfilePicUpload, updateSuperAdminProfile);

module.exports = router;
