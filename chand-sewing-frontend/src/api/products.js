import axiosClient from "./axiosClient";

/**
 * All Fake-Store-API specific calls live here.
 * Later, point these at your real endpoints — nothing outside
 * /api or /services needs to know the data source changed.
 */

export const fetchProducts = async () => {
  const { data } = await axiosClient.get("/products");
  return data;
};

export const fetchProduct = async (id) => {
  const { data } = await axiosClient.get(`/products/${id}`);
  return data;
};

export const fetchCategories = async () => {
  const { data } = await axiosClient.get("/products/categories");
  return data;
};

export const fetchProductsByCategory = async (category) => {
  const { data } = await axiosClient.get(
    `/products/category/${encodeURIComponent(category)}`
  );
  return data;
};
