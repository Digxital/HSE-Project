const router = require("express").Router();
const { login, updateProfile, getProfile } = require("../controller/auth.controller");
const auth = require("../middleware/auth");

router.post("/login", login);
router.put("/profile", auth, updateProfile);
router.get("/profile", auth, getProfile);

module.exports = router;
