const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth");
const authorize = require("../middleware/authorize");

const feedbackController = require("../controller/webFeedback.controller");

router.post(
    "/",
    auth,
    authorize(["ADMIN", "SUPERVISOR", "HSE_OFFICER"], ["web"]),
    feedbackController.submitFeedback
);
router.get(
  "/",
  auth,
  authorize(["ADMIN"], ["web"]),
  feedbackController.getAllFeedback
);

module.exports = router;