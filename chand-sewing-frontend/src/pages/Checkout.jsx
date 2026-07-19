import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { useOrders } from "../context/OrderContext";
import { formatPrice } from "../utils/format";
import "./Checkout.css";

const PAYMENT_METHODS = [
  { id: "cod", label: "Cash on Delivery" },
  { id: "card", label: "Credit / Debit Card" },
  { id: "upi", label: "UPI" },
];

export default function Checkout() {
  const { cartItems, cartTotal, refreshCart } = useCart();
  const { user, getSavedAddress } = useAuth();
  const { placeOrder } = useOrders();
  const navigate = useNavigate();

  const [address, setAddress] = useState({
    fullName: user?.name || "",
    phone: "",
    line1: "",
    city: "",
    state: "",
    pincode: "",
  });

  // Pre-fill with whatever address was used last time, if any.
  const [usingSavedAddress, setUsingSavedAddress] = useState(false);
  useEffect(() => {
    const saved = getSavedAddress();
    if (saved) {
      setAddress(saved);
      setUsingSavedAddress(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [placing, setPlacing] = useState(false);
  const [formError, setFormError] = useState("");

  if (cartItems.length === 0) {
    return (
      <div className="section-wrap empty-state">
        <h2>Your cart is empty</h2>
        <p>Add some products before checking out.</p>
      </div>
    );
  }

  const updateField = (field, value) =>
    setAddress((prev) => ({ ...prev, [field]: value }));

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    setFormError("");

    if (!/^\d{10}$/.test(address.phone)) {
      setFormError("Enter a valid 10-digit phone number.");
      return;
    }
    if (!/^\d{6}$/.test(address.pincode)) {
      setFormError("Enter a valid 6-digit pincode.");
      return;
    }

    setPlacing(true);
    try {
      // Backend builds the order from your server-side cart, saves
      // this address to your profile, and empties the cart — all in
      // one call.
      const order = await placeOrder({ shippingAddress: address, paymentMethod });
      await refreshCart();
      navigate(`/order-success/${order._id}`, { replace: true });
    } catch (err) {
      setFormError(err.message || "Could not place order. Please try again.");
    } finally {
      setPlacing(false);
    }
  };

  return (
    <div className="section-wrap checkout-page">
      <div className="section-heading">
        <h2>Checkout</h2>
      </div>

      <form className="checkout-layout" onSubmit={handlePlaceOrder}>
        <div className="checkout-form">
          <div className="checkout-block">
            <h4>Shipping Address</h4>
            {usingSavedAddress && (
              <div className="saved-address-banner">
                Using your saved address.{" "}
                <button
                  type="button"
                  onClick={() => {
                    setAddress({
                      fullName: user?.name || "",
                      phone: "",
                      line1: "",
                      city: "",
                      state: "",
                      pincode: "",
                    });
                    setUsingSavedAddress(false);
                  }}
                >
                  Use a different address
                </button>
              </div>
            )}
            <div className="checkout-grid">
              <label>
                Full Name
                <input
                  required
                  value={address.fullName}
                  onChange={(e) => updateField("fullName", e.target.value)}
                />
              </label>
              <label>
                Phone Number
                <input
                  required
                  value={address.phone}
                  onChange={(e) => updateField("phone", e.target.value)}
                  placeholder="10-digit mobile number"
                />
              </label>
              <label className="span-2">
                Address
                <input
                  required
                  value={address.line1}
                  onChange={(e) => updateField("line1", e.target.value)}
                  placeholder="House no, street, area"
                />
              </label>
              <label>
                City
                <input
                  required
                  value={address.city}
                  onChange={(e) => updateField("city", e.target.value)}
                />
              </label>
              <label>
                State
                <input
                  required
                  value={address.state}
                  onChange={(e) => updateField("state", e.target.value)}
                />
              </label>
              <label>
                Pincode
                <input
                  required
                  value={address.pincode}
                  onChange={(e) => updateField("pincode", e.target.value)}
                  placeholder="6-digit pincode"
                />
              </label>
            </div>
          </div>

          <div className="checkout-block">
            <h4>Payment Method</h4>
            <div className="payment-options">
              {PAYMENT_METHODS.map((pm) => (
                <label key={pm.id} className="payment-option">
                  <input
                    type="radio"
                    name="paymentMethod"
                    checked={paymentMethod === pm.id}
                    onChange={() => setPaymentMethod(pm.id)}
                  />
                  {pm.label}
                </label>
              ))}
            </div>
            {paymentMethod !== "cod" && (
              <p className="payment-note">
                This is a demo checkout — no real payment is processed. In
                production this step would hand off to your payment
                gateway.
              </p>
            )}
          </div>

          {formError && <p className="auth-error">{formError}</p>}
        </div>

        <div className="cart-summary checkout-summary">
          <h3>Order Summary</h3>
          {cartItems.map((item) => (
            <div className="summary-row" key={item.id}>
              <span>
                {item.title.length > 28 ? item.title.slice(0, 28) + "…" : item.title} × {item.qty}
              </span>
              <span>{formatPrice(item.price * item.qty)}</span>
            </div>
          ))}
          <div className="summary-row">
            <span>Shipping</span>
            <span>Free</span>
          </div>
          <div className="summary-row total">
            <span>Total</span>
            <span>{formatPrice(cartTotal)}</span>
          </div>
          <button type="submit" className="btn-buy-now" style={{ width: "100%", marginTop: 12 }} disabled={placing}>
            {placing ? "Placing Order..." : "Place Order"}
          </button>
        </div>
      </form>
    </div>
  );
}
