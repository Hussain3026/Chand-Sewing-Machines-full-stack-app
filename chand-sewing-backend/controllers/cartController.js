const Cart = require("../models/Cart");
const Product = require("../models/Product");

const populateAndFormat = async (cart) => {
  await cart.populate("items.product");
  return {
    items: cart.items
      .filter((i) => i.product) // guard against deleted products
      .map((i) => ({
        ...i.product.toClientJSON(),
        qty: i.qty,
      })),
  };
};

// @route GET /api/cart
const getCart = async (req, res, next) => {
  try {
    let cart = await Cart.findOne({ user: req.user._id });
    if (!cart) cart = await Cart.create({ user: req.user._id, items: [] });
    res.json(await populateAndFormat(cart));
  } catch (err) {
    next(err);
  }
};

// @route POST /api/cart  { productId, qty }
const addToCart = async (req, res, next) => {
  try {
    const { productId, qty = 1 } = req.body;
    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: "Product not found." });

    let cart = await Cart.findOne({ user: req.user._id });
    if (!cart) cart = await Cart.create({ user: req.user._id, items: [] });

    const existing = cart.items.find((i) => i.product.toString() === productId);
    if (existing) {
      existing.qty += qty;
    } else {
      cart.items.push({ product: productId, qty });
    }

    await cart.save();
    res.json(await populateAndFormat(cart));
  } catch (err) {
    next(err);
  }
};

// @route PUT /api/cart/:productId  { qty }
const updateCartItem = async (req, res, next) => {
  try {
    const { qty } = req.body;
    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) return res.status(404).json({ message: "Cart not found." });

    const item = cart.items.find((i) => i.product.toString() === req.params.productId);
    if (!item) return res.status(404).json({ message: "Item not in cart." });

    item.qty = Math.max(1, qty);
    await cart.save();
    res.json(await populateAndFormat(cart));
  } catch (err) {
    next(err);
  }
};

// @route DELETE /api/cart/:productId
const removeCartItem = async (req, res, next) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) return res.status(404).json({ message: "Cart not found." });

    cart.items = cart.items.filter((i) => i.product.toString() !== req.params.productId);
    await cart.save();
    res.json(await populateAndFormat(cart));
  } catch (err) {
    next(err);
  }
};

// @route DELETE /api/cart
const clearCart = async (req, res, next) => {
  try {
    await Cart.findOneAndUpdate(
      { user: req.user._id },
      { items: [] },
      { upsert: true }
    );
    res.json({ items: [] });
  } catch (err) {
    next(err);
  }
};

module.exports = { getCart, addToCart, updateCartItem, removeCartItem, clearCart };
