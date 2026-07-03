const express = require("express");
const router = express.Router();

const superAdminAuth = require("../middleware/superAdminAuth");
const validateObjectId = require("../middleware/validateObjectId");
const { uploadOrganizationLogo } = require("../utils/multer");
const {
    createOrganization,
    getOrganizations,
    getOrganizationById,
    updateOrganization,
    updateOrganizationStatus,
    activateOrganization,
    deactivateOrganization,
    deleteOrganization
} = require("../controller/organization.controller");
  
const handleLogoUpload = (req, res, next) => {
    uploadOrganizationLogo.single("logo")(req, res, (err) => {
        if (err) {
            return res.status(400).json({
                success: false,
                message: err.message || "Invalid logo upload",
                data: {}
            });
        }

        next();
    });
};

router.get("/organizations", superAdminAuth, getOrganizations);
router.get("/organizations/:id", superAdminAuth, validateObjectId, getOrganizationById);
router.post(
    "/organizations",
    superAdminAuth,
    handleLogoUpload,
    createOrganization
);  
router.put(
    "/organizations/:id",
    superAdminAuth,
    validateObjectId,
    handleLogoUpload,
    updateOrganization
);
router.patch(
    "/organizations/:id",
    superAdminAuth,
    validateObjectId,
    handleLogoUpload,
    updateOrganization
);
router.patch("/organizations/:id/status", superAdminAuth, validateObjectId, updateOrganizationStatus);
router.patch("/organizations/:id/activate", superAdminAuth, validateObjectId, activateOrganization);
router.patch("/organizations/:id/deactivate", superAdminAuth, validateObjectId, deactivateOrganization);
router.delete("/organizations/:id", superAdminAuth, validateObjectId, deleteOrganization);

module.exports = router;
