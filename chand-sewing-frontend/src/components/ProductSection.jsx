import React from "react";
import { Link } from "react-router-dom";
import ProductCard from "./ProductCard";
import SkeletonCard from "./SkeletonCard";
import ErrorMessage from "./ErrorMessage";

export default function ProductSection({
  title,
  subtitle,
  products,
  loading,
  error,
  onRetry,
  viewAllLink = "/shop",
}) {
  return (
    <section className="section-wrap">
      <div className="section-heading">
        <div>
          <h2>{title}</h2>
          {subtitle && <p>{subtitle}</p>}
        </div>
        <Link to={viewAllLink} className="view-all-link">
          View All →
        </Link>
      </div>

      {error ? (
        <ErrorMessage message={error} onRetry={onRetry} />
      ) : (
        <div className="product-grid">
          {loading
            ? Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)
            : products.map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
      )}
    </section>
  );
}
