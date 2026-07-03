const express = require("express");
const router = express.Router();

const {
    adminRegister,
    adminLogin,
    adminMicrosoftLogin,
    adminLogout
} = require("../controller/admin.auth.controller");
  
router.post("/register", adminRegister);
router.post("/login", adminLogin); 
router.post("/microsoft-login", adminMicrosoftLogin);
router.post("/logout", adminLogout);
  
module.exports = router; 
   