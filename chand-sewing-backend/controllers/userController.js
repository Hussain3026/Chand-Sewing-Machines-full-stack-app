const User = require("../models/User");
const Order = require("../models/Order");
const Wishlist = require("../models/Wishlist");

// @route GET /api/users/profile
const getUserProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    res.json({ user: user.toSafeObject() });
  } catch (err) {
    next(err);
  }
};

// @route GET /api/users/orders
const getUserOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .populate("items.product", "title image price");
    res.json({ orders });
  } catch (err) {
    next(err);
  }
};

// @route GET /api/users/wishlist
const getUserWishlist = async (req, res, next) => {
  try {
    let wishlist = await Wishlist.findOne({ user: req.user._id }).populate("products");
    if (!wishlist) {
      wishlist = await Wishlist.create({ user: req.user._id, products: [] });
    }
    res.json({ items: wishlist.products.map((p) => p.toClientJSON()) });
  } catch (err) {
    next(err);
  }
};

// @route GET /api/users/dashboard
const getUserDashboard = async (req, res, next) => {
  try {
    const [orders, wishlist, user] = await Promise.all([
      Order.find({ user: req.user._id }).sort({ createdAt: -1 }),
      Wishlist.findOne({ user: req.user._id }),
      User.findById(req.user._id).select("-password"),
    ]);

    const totalSpent = orders.reduce((sum, o) => sum + o.total, 0);
    const recentOrders = orders.slice(0, 5);

    res.json({
      user: user.toSafeObject(),
      stats: {
        totalOrders: orders.length,
        totalSpent,
        wishlistCount: wishlist ? wishlist.products.length : 0,
      },
      recentOrders,
      savedAddress: user.address,
    });
  } catch (err) {
    next(err);
  }
};

// @route PUT /api/users/address
const updateAddress = async (req, res, next) => {
  try {
    const { fullName, phone, line1, city, state, pincode, lat, lng } = req.body;
    const user = await User.findById(req.user._id);
    user.address = { fullName, phone, line1, city, state, pincode, lat, lng };
    await user.save();
    res.json({ address: user.address });
  } catch (err) {
    next(err);
  }
};

// @route PUT /api/users/profile
const updateProfile = async (req, res, next) => {
  try {
    const { name, email, phone } = req.body;
    const user = await User.findById(req.user._id);

    if (email && email.toLowerCase() !== user.email) {
      const taken = await User.findOne({ email: email.toLowerCase() });
      if (taken) {
        return res.status(409).json({ message: "That email is already in use." });
      }
      user.email = email.toLowerCase();
      user.isEmailVerified = false;
    }

    if (name) user.name = name;
    if (phone !== undefined) user.phone = phone;

    await user.save();
    res.json({ user: user.toSafeObject() });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getUserProfile,
  getUserOrders,
  getUserWishlist,
  getUserDashboard,
  updateAddress,
  updateProfile,
};
