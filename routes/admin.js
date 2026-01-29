const router = require("express").Router();
const auth = require("../middleware/auth");
const authorize = require("../middleware/authorize");
const { createFieldUser } = require("../controller/admin.controller");

router.post(
  "/users",
  auth,
  authorize(["ADMIN"], ["web"]),
  createFieldUser
);

module.exports = router;
