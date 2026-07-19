const Product = require("../models/Product");

// @route GET /api/products
const getProducts = async (req, res, next) => {
  try {
    const products = await Product.find().sort({ createdAt: 1 });
    res.json(products.map((p) => p.toClientJSON()));
  } catch (err) {
    next(err);
  }
};

// @route GET /api/products/:id
const getProductById = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found." });
    res.json(product.toClientJSON());
  } catch (err) {
    if (err.name === "CastError") {
      return res.status(404).json({ message: "Product not found." });
    }
    next(err);
  }
};

// @route GET /api/products/categories
const getCategories = async (req, res, next) => {
  try {
    const categories = await Product.distinct("category");
    res.json(categories);
  } catch (err) {
    next(err);
  }
};

// @route GET /api/products/category/:category
const getProductsByCategory = async (req, res, next) => {
  try {
    const products = await Product.find({ category: req.params.category });
    res.json(products.map((p) => p.toClientJSON()));
  } catch (err) {
    next(err);
  }
};

module.exports = { getProducts, getProductById, getCategories, getProductsByCategory };
