import React from "react";
import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="section-wrap empty-state">
      <h2>404 — Page Not Found</h2>
      <p>The page you're looking for doesn't exist.</p>
      <Link to="/" className="view-all-link">Back to Home</Link>
    </div>
  );
}
