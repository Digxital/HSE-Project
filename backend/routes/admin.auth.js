const express = require("express");
const router = express.Router();

const {
    adminRegister,
    adminLogin
} = require("../controller/admin.auth.controller");

router.post("/register", adminRegister);
router.post("/login", adminLogin); 
router.post("/logout", adminLogout);
  
module.exports = router; 