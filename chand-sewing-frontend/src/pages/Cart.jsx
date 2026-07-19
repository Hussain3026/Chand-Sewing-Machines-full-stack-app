import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiTrash2 } from "react-icons/fi";
import { useCart } from "../context/CartContext";
import { formatPrice } from "../utils/format";
import "./Cart.css";

export default function Cart() {
  const { cartItems, removeFromCart, updateQty, cartTotal, clearCart } = useCart();
  const navigate = useNavigate();

  if (cartItems.length === 0) {
    return (
      <div className="section-wrap empty-state">
        <h2>Your cart is empty</h2>
        <p>Looks like you haven't added any machines yet.</p>
        <Link to="/shop" className="view-all-link">
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="section-wrap cart-page">
      <div className="section-heading">
        <h2>Your Cart ({cartItems.length})</h2>
        <button className="btn-clear-filters" onClick={clearCart}>
          Clear Cart
        </button>
      </div>

      <div className="cart-layout">
        <div className="cart-items">
          {cartItems.map((item) => (
            <div className="cart-row" key={item.id}>
              <img src={item.image} alt={item.title} />
              <div className="cart-row-info">
                <Link to={`/product/${item.id}`}>{item.title}</Link>
                <span className="product-category">{item.category}</span>
                <div className="qty-selector">
                  <button onClick={() => updateQty(item.id, item.qty - 1)}>-</button>
                  <input readOnly value={item.qty} />
                  <button onClick={() => updateQty(item.id, item.qty + 1)}>+</button>
                </div>
              </div>
              <div className="cart-row-price">{formatPrice(item.price * item.qty)}</div>
              <button className="cart-remove" onClick={() => removeFromCart(item.id)}>
                <FiTrash2 />
              </button>
            </div>
          ))}
        </div>

        <div className="cart-summary">
          <h3>Order Summary</h3>
          <div className="summary-row">
            <span>Subtotal</span>
            <span>{formatPrice(cartTotal)}</span>
          </div>
          <div className="summary-row">
            <span>Shipping</span>
            <span>Free</span>
          </div>
          <div className="summary-row total">
            <span>Total</span>
            <span>{formatPrice(cartTotal)}</span>
          </div>
          <button
            className="btn-buy-now"
            style={{ width: "100%", marginTop: 12 }}
            onClick={() => navigate("/checkout")}
          >
            Proceed to Checkout
          </button>
        </div>
      </div>
    </div>
  );
}
