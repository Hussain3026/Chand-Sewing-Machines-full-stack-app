import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";

export default function OtpVerification({ email, onSuccess, onBack }) {
  const { verifyOtp, sendOtp } = useAuth();
  const [otp, setOtp] = useState("");
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);

  useEffect(() => {
    if (resendTimer <= 0) {
      setCanResend(true);
      return;
    }
    const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
    return () => clearTimeout(timer);
  }, [resendTimer]);

  const handleVerify = async (e) => {
    e.preventDefault();
    setStatus(null);
    setLoading(true);
    try {
      await verifyOtp({ email, otp });
      setStatus({ type: "success", message: "Email verified successfully!" });
      setTimeout(() => onSuccess(), 1500);
    } catch (err) {
      setStatus({ type: "error", message: err.message });
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setCanResend(false);
    setResendTimer(60);
    setStatus(null);
    try {
      await sendOtp(email);
      setStatus({ type: "success", message: "A new OTP has been sent to your email." });
    } catch (err) {
      setStatus({ type: "error", message: err.message });
    }
  };

  return (
    <div className="otp-verification">
      <h3>Verify Your Email</h3>
      <p className="otp-subtitle">
        We've sent a 6-digit code to <strong>{email}</strong>
      </p>

      <form onSubmit={handleVerify} className="auth-form">
        <label>
          Enter OTP
          <input
            type="text"
            value={otp}
            onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
            placeholder="6-digit code"
            required
            maxLength={6}
            style={{ textAlign: "center", fontSize: "20px", letterSpacing: "8px" }}
          />
        </label>

        {status && (
          <p className={status.type === "success" ? "account-success" : "auth-error"}>
            {status.message}
          </p>
        )}

        <button type="submit" className="btn-buy-now auth-submit" disabled={loading || otp.length < 6}>
          {loading ? "Verifying..." : "Verify Email"}
        </button>
      </form>

      <div className="otp-actions">
        {canResend ? (
          <button type="button" className="otp-resend-btn" onClick={handleResend}>
            Resend OTP
          </button>
        ) : (
          <span className="otp-timer">Resend OTP in {resendTimer}s</span>
        )}
        <button type="button" className="otp-back-btn" onClick={onBack}>
          ← Back to Login
        </button>
      </div>
    </div>
  );
}
