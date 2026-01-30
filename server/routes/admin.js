const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth");
const authorize = require("../middleware/authorize");
const { createUser } = require("../controller/admin.controller");


router.post(
  "/users",
  auth,
  authorize(["ADMIN"], ["web"]),
  createUser
);

module.exports = router;
