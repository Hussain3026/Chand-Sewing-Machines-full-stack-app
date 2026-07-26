const express = require("express");
const { protect } = require("../middleware/auth");
const {
  register,
  login,
  getMe,
  updateProfile,
  changePassword,
  saveAddress,
} = require("../controllers/authController");
const { sendEmailOTP, verifyOTP } = require("../controllers/otpController");

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/me", protect, getMe);
router.put("/profile", protect, updateProfile);
router.put("/password", protect, changePassword);
router.put("/address", protect, saveAddress);
router.post("/otp/send-email", sendEmailOTP);
router.post("/otp/verify", verifyOTP);

module.exports = router;
