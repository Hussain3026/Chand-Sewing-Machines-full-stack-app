const express = require("express");
const { protect } = require("../middleware/auth");
const {
  getUserProfile,
  getUserOrders,
  getUserWishlist,
  getUserDashboard,
  updateAddress,
  updateProfile,
} = require("../controllers/userController");

const router = express.Router();

router.use(protect);

router.get("/profile", getUserProfile);
router.put("/profile", updateProfile);
router.get("/orders", getUserOrders);
router.get("/wishlist", getUserWishlist);
router.get("/dashboard", getUserDashboard);
router.put("/address", updateAddress);

module.exports = router;
