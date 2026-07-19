import React from "react";
import { Link } from "react-router-dom";
import { useWishlist } from "../context/WishlistContext";
import ProductCard from "../components/ProductCard";

export default function Wishlist() {
  const { wishlistItems } = useWishlist();

  if (wishlistItems.length === 0) {
    return (
      <div className="section-wrap empty-state">
        <h2>Your wishlist is empty</h2>
        <p>Save products you love and find them here anytime.</p>
        <Link to="/shop" className="view-all-link">
          Browse Products
        </Link>
      </div>
    );
  }

  return (
    <div className="section-wrap">
      <div className="section-heading">
        <h2>My Wishlist ({wishlistItems.length})</h2>
      </div>
      <div className="product-grid">
        {wishlistItems.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </div>
  );
}
