import {
  fetchProducts,
  fetchProduct,
  fetchCategories,
  fetchProductsByCategory,
} from "../api/products";

/**
 * Your backend's Product.toClientJSON() (see chand-sewing-backend/models/Product.js)
 * already returns objects shaped exactly like what ProductCard, Shop,
 * ProductDetails etc. expect — id, title, category, image, images,
 * description, price, oldPrice, discountPercent, rating, ratingCount, stock.
 * So this file is now a thin pass-through. If you ever add a field on
 * the backend that needs reshaping for the UI, do it here — nothing
 * else in the app needs to change.
 */

const normalize = (raw) => ({
  id: raw.id,
  title: raw.title,
  category: raw.category,
  image: raw.image,
  images: raw.images && raw.images.length ? raw.images : [raw.image, raw.image, raw.image],
  description: raw.description,
  price: raw.price,
  oldPrice: raw.oldPrice,
  discountPercent: raw.discountPercent,
  rating: raw.rating,
  ratingCount: raw.ratingCount,
  stock: raw.stock,
});

export const getAllProducts = async () => {
  const data = await fetchProducts();
  return data.map(normalize);
};

export const getProductById = async (id) => {
  const data = await fetchProduct(id);
  return normalize(data);
};

export const getAllCategories = async () => {
  return fetchCategories();
};

export const getProductsByCategory = async (category) => {
  const data = await fetchProductsByCategory(category);
  return data.map(normalize);
};
