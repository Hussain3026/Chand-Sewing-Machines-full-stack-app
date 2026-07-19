import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axiosClient from "../api/axiosClient";
import { useAuth } from "./AuthContext";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);

  const refreshCart = useCallback(async () => {
    if (!isAuthenticated) {
      setCartItems([]);
      return;
    }
    setLoading(true);
    try {
      const { data } = await axiosClient.get("/cart");
      setCartItems(data.items);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    refreshCart();
  }, [refreshCart]);

  const addToCart = async (product, qty = 1) => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    const { data } = await axiosClient.post("/cart", { productId: product.id, qty });
    setCartItems(data.items);
  };

  const removeFromCart = async (id) => {
    const { data } = await axiosClient.delete(`/cart/${id}`);
    setCartItems(data.items);
  };

  const updateQty = async (id, qty) => {
    const { data } = await axiosClient.put(`/cart/${id}`, { qty: Math.max(1, qty) });
    setCartItems(data.items);
  };

  const clearCart = async () => {
    await axiosClient.delete("/cart");
    setCartItems([]);
  };

  const cartCount = cartItems.reduce((sum, item) => sum + item.qty, 0);
  const cartTotal = cartItems.reduce((sum, item) => sum + item.qty * item.price, 0);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQty,
        clearCart,
        cartCount,
        cartTotal,
        loading,
        refreshCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
