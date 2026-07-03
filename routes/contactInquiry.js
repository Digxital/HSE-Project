const express = require("express");
const router = express.Router();

const {
  submitContactForm,
} = require("../controller/contactInquiry.controller");

router.post("/contact", submitContactForm);

module.exports = router;