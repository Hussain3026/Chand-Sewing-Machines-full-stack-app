import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axiosClient from "../api/axiosClient";
import { useAuth } from "./AuthContext";

const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [wishlistItems, setWishlistItems] = useState([]);

  const refreshWishlist = useCallback(async () => {
    if (!isAuthenticated) {
      setWishlistItems([]);
      return;
    }
    try {
      const { data } = await axiosClient.get("/wishlist");
      setWishlistItems(data.items);
    } catch (err) {
      console.error(err);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    refreshWishlist();
  }, [refreshWishlist]);

  const isInWishlist = (id) => wishlistItems.some((item) => item.id === id);

  const toggleWishlist = async (product) => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    const { data } = await axiosClient.post(`/wishlist/${product.id}`);
    setWishlistItems(data.items);
  };

  const removeFromWishlist = async (id) => {
    // Toggling on an item already in the wishlist removes it.
    const { data } = await axiosClient.post(`/wishlist/${id}`);
    setWishlistItems(data.items);
  };

  return (
    <WishlistContext.Provider
      value={{ wishlistItems, isInWishlist, toggleWishlist, removeFromWishlist }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => useContext(WishlistContext);
