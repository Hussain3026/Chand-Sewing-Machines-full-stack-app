const express = require("express");
const { protect } = require("../middleware/auth");
const { sendEmailOTP, verifyOTP } = require("../controllers/otpController");

const router = express.Router();

router.post("/send-email", sendEmailOTP);
router.post("/verify", verifyOTP);

module.exports = router;
