import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FiHeart, FiEye, FiShoppingCart } from "react-icons/fi";
import RatingStars from "./RatingStars";
import QuickViewModal from "./QuickViewModal";
import { formatPrice } from "../utils/format";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import "./ProductCard.css";

export default function ProductCard({ product }) {
  const [showQuickView, setShowQuickView] = useState(false);
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const inWishlist = isInWishlist(product.id);

  return (
    <>
      <div className="product-card">
        {product.discountPercent > 0 && (
          <span className="discount-badge-corner">{product.discountPercent}% OFF</span>
        )}

        <button
          className={`wishlist-btn ${inWishlist ? "active" : ""}`}
          onClick={() => toggleWishlist(product)}
          aria-label="Toggle wishlist"
        >
          <FiHeart size={18} />
        </button>

        <Link to={`/product/${product.id}`} className="product-img-wrap">
          <img src={product.image} alt={product.title} className="product-img" />
          <button
            className="quick-view-btn"
            onClick={(e) => {
              e.preventDefault();
              setShowQuickView(true);
            }}
          >
            <FiEye size={15} /> Quick View
          </button>
        </Link>

        <div className="product-info">
          <span className="product-category">{product.category}</span>
          <Link to={`/product/${product.id}`} className="product-title">
            {product.title}
          </Link>
          <RatingStars rating={product.rating} count={product.ratingCount} />
          <div className="price-row">
            <span className="price">{formatPrice(product.price)}</span>
            <span className="old-price">{formatPrice(product.oldPrice)}</span>
          </div>
          <button className="btn-add-cart" onClick={() => addToCart(product, 1)}>
            <FiShoppingCart size={15} /> Add to Cart
          </button>
        </div>
      </div>

      {showQuickView && (
        <QuickViewModal product={product} onClose={() => setShowQuickView(false)} />
      )}
    </>
  );
}
