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

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/me", protect, getMe);
router.put("/profile", protect, updateProfile);
router.put("/password", protect, changePassword);
router.put("/address", protect, saveAddress);

module.exports = router;
