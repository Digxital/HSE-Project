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
router.post("/config/incident-categories", createIncidentCategory);
router.get("/config/incident-categories", getIncidentCategories);
router.put("/config/incident-categories/:id", updateIncidentCategory);
router.delete("/config/incident-categories/:id", deleteIncidentCategory);

// Risk Levels
router.post("/config/risk-levels", createRiskLevel);
router.get("/config/risk-levels", getRiskLevels);
router.put("/config/risk-levels/:id", updateRiskLevel);
router.delete("/config/risk-levels/:id", deleteRiskLevel);

// Inspection Templates
router.post("/config/inspection-templates", createInspectionTemplate);
router.get("/config/inspection-templates", getInspectionTemplates);
router.put("/config/inspection-templates/:id", updateInspectionTemplate);
router.delete("/config/inspection-templates/:id", deleteInspectionTemplate);

// Safety Policies
router.post("/config/safety-policies", createSafetyPolicy);
router.get("/config/safety-policies", getSafetyPolicies);
router.put("/config/safety-policies/:id", updateSafetyPolicy);
router.delete("/config/safety-policies/:id", deleteSafetyPolicy);

// System Settings
router.post("/config/system-settings", createSystemSetting);
router.get("/config/system-settings", getSystemSettings);
router.put("/config/system-settings/:id", updateSystemSetting);
router.delete("/config/system-settings/:id", deleteSystemSetting);

module.exports = router;
