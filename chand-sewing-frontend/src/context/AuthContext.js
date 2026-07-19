import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import axiosClient from "../api/axiosClient";

const AuthContext = createContext();
const TOKEN_KEY = "csm_token";

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // On first load, if a token is saved, fetch the current user with it.
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
      return data.user;
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
  };

  const updateProfile = async ({ name, email }) => {
    const { data } = await axiosClient.put("/auth/profile", { name, email });
    setUser(data.user);
    return data.user;
  };

  const changePassword = async ({ currentPassword, newPassword }) => {
    await axiosClient.put("/auth/password", { currentPassword, newPassword });
  };

  // Address lives on the user object now (fetched at login/`/auth/me`),
  // so reading it is synchronous — same as the old mock version.
  const getSavedAddress = useCallback(() => user?.address || null, [user]);

  const saveAddress = async (address) => {
    const { data } = await axiosClient.put("/auth/address", address);
    setUser((prev) => ({ ...prev, address: data.address }));
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
        loading,
        error,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
