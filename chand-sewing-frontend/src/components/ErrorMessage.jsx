import React from "react";
import { FiAlertTriangle } from "react-icons/fi";

export default function ErrorMessage({ message, onRetry }) {
  return (
    <div className="error-box">
      <FiAlertTriangle size={36} color="#c0392b" />
      <p>{message || "Something went wrong. Please try again."}</p>
      {onRetry && (
        <button className="btn-retry" onClick={onRetry}>
          Retry
        </button>
      )}
    </div>
  );
}
