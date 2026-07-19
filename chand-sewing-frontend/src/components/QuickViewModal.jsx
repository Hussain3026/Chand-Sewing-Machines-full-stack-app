import React from "react";
import { FiX } from "react-icons/fi";
import { Link } from "react-router-dom";
import RatingStars from "./RatingStars";
import { formatPrice } from "../utils/format";
import { useCart } from "../context/CartContext";

export default function QuickViewModal({ product, onClose }) {
  const { addToCart } = useCart();
  if (!product) return null;

  return (
    <div className="qv-overlay" onClick={onClose}>
      <div className="qv-modal" onClick={(e) => e.stopPropagation()}>
        <button className="qv-close" onClick={onClose} aria-label="Close quick view">
          <FiX size={22} />
        </button>
        <div className="qv-body">
          <div className="qv-image">
            <img src={product.image} alt={product.title} />
          </div>
          <div className="qv-details">
            <span className="qv-category">{product.category}</span>
            <h3>{product.title}</h3>
            <RatingStars rating={product.rating} count={product.ratingCount} />
            <div className="price-row">
              <span className="price">{formatPrice(product.price)}</span>
              <span className="old-price">{formatPrice(product.oldPrice)}</span>
              <span className="discount-badge">{product.discountPercent}% OFF</span>
            </div>
            <p className="qv-desc">{product.description}</p>
            <div className="qv-actions">
              <button className="btn-add-cart" onClick={() => addToCart(product, 1)}>
                Add to Cart
              </button>
              <Link to={`/product/${product.id}`} className="btn-view-full">
                View Full Details
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
