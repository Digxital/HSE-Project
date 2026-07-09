const express = require("express");
const router = express.Router();

const validateObjectId = require("../middleware/validateObjectId");
const {
    submitDemoRequest,
    getDemoRequests,
    getDemoRequestById
} = require("../controller/demoRequest.controller");

router.post("/demo-request", submitDemoRequest);
router.get("/demo-request", getDemoRequests);
router.get("/demo-request/:id", validateObjectId, getDemoRequestById);

module.exports = router;
