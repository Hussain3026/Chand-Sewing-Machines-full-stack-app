const express = require("express");
const { protect } = require("../middleware/auth");
const { placeOrder, getMyOrders, getOrderById } = require("../controllers/orderController");

const router = express.Router();

router.use(protect);

router.post("/", placeOrder);
router.get("/", getMyOrders);
router.get("/:id", getOrderById);

module.exports = router;
