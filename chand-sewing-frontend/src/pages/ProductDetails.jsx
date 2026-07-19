import React, { useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import useProduct from "../hooks/useProduct";
import useProducts from "../hooks/useProducts";
import RatingStars from "../components/RatingStars";
import ProductCard from "../components/ProductCard";
import SkeletonCard from "../components/SkeletonCard";
import ErrorMessage from "../components/ErrorMessage";
import { formatPrice } from "../utils/format";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import { FiHeart, FiShoppingCart } from "react-icons/fi";
import "./ProductDetails.css";

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { product, loading, error } = useProduct(id);
  const { products: allProducts } = useProducts();
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();

  const [activeImage, setActiveImage] = useState(0);
  const [qty, setQty] = useState(1);

  const related = useMemo(() => {
    if (!product) return [];
    return allProducts
      .filter((p) => p.category === product.category && p.id !== product.id)
      .slice(0, 4);
  }, [allProducts, product]);

  if (loading) {
    return (
      <div className="section-wrap">
        <div className="product-grid">
          <SkeletonCard />
          <SkeletonCard />
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="section-wrap">
        <ErrorMessage message={error || "Product not found."} />
      </div>
    );
  }

  const inWishlist = isInWishlist(product.id);

  return (
    <div className="section-wrap product-details-page">
      <div className="pd-layout">
        <div className="pd-gallery">
          <div className="pd-main-image">
            <img src={product.images[activeImage]} alt={product.title} />
          </div>
          <div className="pd-thumbs">
            {product.images.map((img, i) => (
              <button
                key={i}
                className={i === activeImage ? "active" : ""}
                onClick={() => setActiveImage(i)}
              >
                <img src={img} alt={`${product.title} ${i + 1}`} />
              </button>
            ))}
          </div>
        </div>

        <div className="pd-info">
          <span className="qv-category">{product.category}</span>
          <h1>{product.title}</h1>
          <div className="pd-rating-row">
            <RatingStars rating={product.rating} count={product.ratingCount} />
            <span className="pd-reviews-link">{product.ratingCount} reviews</span>
          </div>

          <div className="price-row">
            <span className="price" style={{ fontSize: 26 }}>
              {formatPrice(product.price)}
            </span>
            <span className="old-price">{formatPrice(product.oldPrice)}</span>
            <span className="discount-badge">{product.discountPercent}% OFF</span>
          </div>

          <p className="pd-description">{product.description}</p>

          <p className="pd-stock">
            {product.stock > 0 ? (
              <span className="in-stock">In Stock ({product.stock} available)</span>
            ) : (
              <span className="out-stock">Out of Stock</span>
            )}
          </p>

          <div className="pd-qty-row">
            <span>Quantity</span>
            <div className="qty-selector">
              <button onClick={() => setQty((q) => Math.max(1, q - 1))}>-</button>
              <input readOnly value={qty} />
              <button onClick={() => setQty((q) => Math.min(product.stock, q + 1))}>
                +
              </button>
            </div>
          </div>

          <div className="pd-actions">
            <button
              className="btn-add-cart pd-btn"
              onClick={() => addToCart(product, qty)}
            >
              <FiShoppingCart /> Add to Cart
            </button>
            <button
              className="btn-buy-now pd-btn"
              onClick={() => {
                addToCart(product, qty);
                navigate("/checkout");
              }}
            >
              Buy Now
            </button>
            <button
              className={`btn-wishlist-outline ${inWishlist ? "active" : ""}`}
              onClick={() => toggleWishlist(product)}
            >
              <FiHeart /> {inWishlist ? "Wishlisted" : "Wishlist"}
            </button>
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <div className="pd-related">
          <div className="section-heading">
            <div>
              <h2>Related Products</h2>
            </div>
          </div>
          <div className="product-grid">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
