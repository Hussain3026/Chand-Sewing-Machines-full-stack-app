const Wishlist = require("../models/Wishlist");

const format = async (wishlist) => {
  await wishlist.populate("products");
  return { items: wishlist.products.map((p) => p.toClientJSON()) };
};

// @route GET /api/wishlist
const getWishlist = async (req, res, next) => {
  try {
    let wishlist = await Wishlist.findOne({ user: req.user._id });
    if (!wishlist) wishlist = await Wishlist.create({ user: req.user._id, products: [] });
    res.json(await format(wishlist));
  } catch (err) {
    next(err);
  }
};

// @route POST /api/wishlist/:productId  (toggle add/remove)
const toggleWishlist = async (req, res, next) => {
  try {
    let wishlist = await Wishlist.findOne({ user: req.user._id });
    if (!wishlist) wishlist = await Wishlist.create({ user: req.user._id, products: [] });

    const { productId } = req.params;
    const exists = wishlist.products.some((p) => p.toString() === productId);

    wishlist.products = exists
      ? wishlist.products.filter((p) => p.toString() !== productId)
      : [...wishlist.products, productId];

    await wishlist.save();
    res.json(await format(wishlist));
  } catch (err) {
    next(err);
  }
};

module.exports = { getWishlist, toggleWishlist };
