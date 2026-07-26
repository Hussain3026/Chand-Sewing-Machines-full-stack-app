import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import OtpVerification from "../components/OtpVerification";
import "./Auth.css";

export default function Register() {
  const { register, loading, error, setPendingVerificationEmail } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [formError, setFormError] = useState("");
  const [showOtp, setShowOtp] = useState(false);
  const [registeredEmail, setRegisteredEmail] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");

    if (password !== confirmPassword) {
      setFormError("Passwords do not match.");
      return;
    }
    if (password.length < 6) {
      setFormError("Password must be at least 6 characters.");
      return;
    }

    try {
      const result = await register({ name, email, password });
      if (result?.requiresVerification) {
        setRegisteredEmail(email);
        setPendingVerificationEmail(email);
        setShowOtp(true);
        return;
      }
      navigate("/", { replace: true });
    } catch {
      // error already set in context
    }
  };

  const handleOtpSuccess = () => {
    navigate("/", { replace: true });
  };

  const handleOtpBack = () => {
    setShowOtp(false);
    setPendingVerificationEmail(null);
  };

  if (showOtp) {
    return (
      <div className="section-wrap auth-page">
        <div className="auth-card">
          <OtpVerification
            email={registeredEmail}
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
        <h2>Create Account</h2>
        <p className="auth-subtitle">Join Chand Sewing Machines</p>

        <form onSubmit={handleSubmit} className="auth-form">
          <label>
            Full Name
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              placeholder="Your name"
            />
          </label>
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
              placeholder="At least 6 characters"
            />
          </label>
          <label>
            Confirm Password
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              placeholder="Re-enter password"
            />
          </label>

          {(error || formError) && (
            <p className="auth-error">{formError || error}</p>
          )}

          <button type="submit" className="btn-buy-now auth-submit" disabled={loading}>
            {loading ? "Creating account..." : "Register"}
          </button>
        </form>

        <p className="auth-switch">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
}
