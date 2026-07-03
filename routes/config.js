const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth");
const authorize = require("../middleware/authorize");
const platformWeb = require("../middleware/platformWeb");

const {
    createIncidentCategory,
    getIncidentCategories,
    updateIncidentCategory,
    deleteIncidentCategory
} = require("../controller/config/incidentCategory.controller");

const {
    createRiskLevel,
    getRiskLevels,
    updateRiskLevel,
    deleteRiskLevel
} = require("../controller/config/riskLevel.controller");

const {
    createInspectionTemplate,
    getInspectionTemplates,
    updateInspectionTemplate,
    deleteInspectionTemplate
} = require("../controller/config/inspectionTemplate.controller");

const {
    createSafetyPolicy,
    getSafetyPolicies,
    updateSafetyPolicy,
    deleteSafetyPolicy
} = require("../controller/config/safetyPolicy.controller");

const {
    createSystemSetting,
    getSystemSettings,
    updateSystemSetting,
    deleteSystemSetting
} = require("../controller/config/systemSetting.controller");

router.use(auth, platformWeb, authorize(["ADMIN"], ["web"]));

// Incident Categories
router.post("/incident-categories", createIncidentCategory);
router.get("/incident-categories", getIncidentCategories);
router.put("/incident-categories/:id", updateIncidentCategory);
router.delete("/incident-categories/:id", deleteIncidentCategory);

// Risk Levels
router.post("/risk-levels", createRiskLevel);
router.get("/risk-levels", getRiskLevels);
router.put("/risk-levels/:id", updateRiskLevel);
router.delete("/risk-levels/:id", deleteRiskLevel);

// Inspection Templates
router.post("/inspection-templates", createInspectionTemplate);
router.get("/inspection-templates", getInspectionTemplates);
router.put("/inspection-templates/:id", updateInspectionTemplate);
router.delete("/inspection-templates/:id", deleteInspectionTemplate);

// Safety Policies
router.post("/safety-policies", createSafetyPolicy);
router.get("/safety-policies", getSafetyPolicies);
router.put("/safety-policies/:id", updateSafetyPolicy);
router.delete("/safety-policies/:id", deleteSafetyPolicy);

// System Settings
router.post("/system-settings", createSystemSetting);
router.get("/system-settings", getSystemSettings);
router.put("/system-settings/:id", updateSystemSetting);
router.delete("/system-settings/:id", deleteSystemSetting);

module.exports = router;
