const Order = require("../models/Order");
const Cart = require("../models/Cart");

// @route POST /api/orders  { shippingAddress, paymentMethod }
// Builds the order from whatever is currently in the user's cart,
// then empties the cart.
const placeOrder = async (req, res, next) => {
  try {
    const { shippingAddress, paymentMethod } = req.body;
    if (!shippingAddress || !paymentMethod) {
      return res.status(400).json({ message: "Shipping address and payment method are required." });
    }

    const cart = await Cart.findOne({ user: req.user._id }).populate("items.product");
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: "Your cart is empty." });
    }

    const items = cart.items
      .filter((i) => i.product)
      .map((i) => ({
        product: i.product._id,
        title: i.product.title,
        image: i.product.image,
        price: i.product.price,
        qty: i.qty,
      }));

    const total = items.reduce((sum, i) => sum + i.price * i.qty, 0);

    const order = await Order.create({
      user: req.user._id,
      items,
      total,
      shippingAddress,
      paymentMethod,
      status: paymentMethod === "cod" ? "Placed (Cash on Delivery)" : "Paid",
    });

    // Remember this address for next time, same as before.
    req.user.address = shippingAddress;
    await req.user.save();

    cart.items = [];
    await cart.save();

    res.status(201).json(order);
  } catch (err) {
    next(err);
  }
};

// @route GET /api/orders
const getMyOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    next(err);
  }
};

// @route GET /api/orders/:id
const getOrderById = async (req, res, next) => {
  try {
    const order = await Order.findOne({ _id: req.params.id, user: req.user._id });
    if (!order) return res.status(404).json({ message: "Order not found." });
    res.json(order);
  } catch (err) {
    if (err.name === "CastError") {
      return res.status(404).json({ message: "Order not found." });
    }
    next(err);
  }
};

module.exports = { placeOrder, getMyOrders, getOrderById };
