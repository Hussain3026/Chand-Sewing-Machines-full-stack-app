import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

/**
 * Wrap any <Route element={...}> with this to require login.
 * Example:
 *   <Route path="/checkout" element={
 *     <ProtectedRoute><Checkout /></ProtectedRoute>
 *   } />
 * Not applied to any route by default — add it where you need it.
 */
export default function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  return children;
}
