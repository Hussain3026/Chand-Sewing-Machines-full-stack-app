import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import OtpVerification from "../components/OtpVerification";
import "./Auth.css";

export default function Login() {
  const { login, loading, error, pendingVerificationEmail, setPendingVerificationEmail } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [formError, setFormError] = useState("");

  const redirectTo = location.state?.from || "/";
  const showOtp = pendingVerificationEmail || location.state?.requiresVerification;
  const otpEmail = pendingVerificationEmail || email;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");
    try {
      const result = await login({ email, password });
      if (result?.requiresVerification) {
        return;
      }
      navigate(redirectTo, { replace: true });
    } catch {
      // error already set in context
    }
  };

  const handleOtpSuccess = () => {
    navigate(redirectTo, { replace: true });
  };

  const handleOtpBack = () => {
    setPendingVerificationEmail(null);
    navigate("/login", { replace: true });
  };

  if (showOtp) {
    return (
      <div className="section-wrap auth-page">
        <div className="auth-card">
          <OtpVerification
            email={otpEmail}
            onSuccess={handleOtpSuccess}
            onBack={handleOtpBack}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="section-wrap auth-page">
      <div className="auth-card">
        <h2>Login</h2>
        <p className="auth-subtitle">Welcome back to Chand Sewing Machines</p>

        <form onSubmit={handleSubmit} className="auth-form">
          <label>
            Email
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="you@example.com"
            />
          </label>
          <label>
            Password
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="••••••••"
            />
          </label>

          {(error || formError) && (
            <p className="auth-error">{error || formError}</p>
          )}

          <button type="submit" className="btn-buy-now auth-submit" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="auth-switch">
          Don't have an account? <Link to="/register">Register</Link>
        </p>
      </div>
    </div>
  );
}
