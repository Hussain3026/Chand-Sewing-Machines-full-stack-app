import React from "react";

export default function SkeletonCard() {
  return (
    <div className="product-card skeleton-card">
      <div className="skeleton skeleton-img" />
      <div className="skeleton skeleton-line" style={{ width: "60%" }} />
      <div className="skeleton skeleton-line" style={{ width: "90%" }} />
      <div className="skeleton skeleton-line" style={{ width: "40%" }} />
      <div className="skeleton skeleton-line" style={{ width: "50%", height: 30 }} />
    </div>
  );
}
