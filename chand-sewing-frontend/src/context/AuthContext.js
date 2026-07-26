import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import axiosClient from "../api/axiosClient";

const AuthContext = createContext();
const TOKEN_KEY = "csm_token";

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pendingVerificationEmail, setPendingVerificationEmail] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) {
      setLoading(false);
      return;
    }
    axiosClient
      .get("/auth/me")
      .then(({ data }) => setUser(data.user))
      .catch(() => localStorage.removeItem(TOKEN_KEY))
      .finally(() => setLoading(false));
  }, []);

  const register = async ({ name, email, password }) => {
    setError(null);
    setLoading(true);
    try {
      const { data } = await axiosClient.post("/auth/register", { name, email, password });
      localStorage.setItem(TOKEN_KEY, data.token);
      setUser(data.user);
      if (data.requiresVerification) {
        setPendingVerificationEmail(email);
      }
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const login = async ({ email, password }) => {
    setError(null);
    setLoading(true);
    try {
      const { data } = await axiosClient.post("/auth/login", { email, password });
      if (data.requiresVerification) {
        setPendingVerificationEmail(data.email || email);
        return { requiresVerification: true, email: data.email || email };
      }
      localStorage.setItem(TOKEN_KEY, data.token);
      setUser(data.user);
      return data.user;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem(TOKEN_KEY);
    setUser(null);
    setPendingVerificationEmail(null);
  };

  const updateProfile = async ({ name, email, phone }) => {
    const { data } = await axiosClient.put("/users/profile", { name, email, phone });
    setUser(data.user);
    return data.user;
  };

  const changePassword = async ({ currentPassword, newPassword }) => {
    await axiosClient.put("/auth/password", { currentPassword, newPassword });
  };

  const getSavedAddress = useCallback(() => user?.address || null, [user]);

  const saveAddress = async (address) => {
    const { data } = await axiosClient.put("/users/address", address);
    setUser((prev) => ({ ...prev, address: data.address }));
    return data.address;
  };

  const sendOtp = async (email) => {
    await axiosClient.post("/auth/otp/send-email", { email });
  };

  const verifyOtp = async ({ email, otp }) => {
    const { data } = await axiosClient.post("/auth/otp/verify", { email, otp });
    if (data.token) {
      localStorage.setItem(TOKEN_KEY, data.token);
    }
    if (data.user) {
      setUser(data.user);
    } else {
      setUser((prev) => (prev ? { ...prev, isEmailVerified: true } : prev));
    }
    setPendingVerificationEmail(null);
    return data;
  };

  const getUserDashboard = async () => {
    const { data } = await axiosClient.get("/users/dashboard");
    return data;
  };

  const getUserOrders = async () => {
    const { data } = await axiosClient.get("/users/orders");
    return data.orders;
  };

  const getUserWishlist = async () => {
    const { data } = await axiosClient.get("/users/wishlist");
    return data.items;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        register,
        logout,
        updateProfile,
        changePassword,
        getSavedAddress,
        saveAddress,
        sendOtp,
        verifyOtp,
        pendingVerificationEmail,
        setPendingVerificationEmail,
        getUserDashboard,
        getUserOrders,
        getUserWishlist,
        loading,
        error,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
