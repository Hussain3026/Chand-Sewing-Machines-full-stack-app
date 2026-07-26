const express = require("express");
const { protect } = require("../middleware/auth");
const { placeOrder, getMyOrders, getOrderById, cancelOrder } = require("../controllers/orderController");

const router = express.Router();

router.use(protect);

router.post("/", placeOrder);
router.get("/", getMyOrders);
router.get("/:id", getOrderById);
router.put("/:id/cancel", cancelOrder);

module.exports = router;
