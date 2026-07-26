import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { useOrders } from "../context/OrderContext";
import { formatPrice } from "../utils/format";
import AddressForm from "../components/AddressForm";
import "./Checkout.css";

const PAYMENT_METHODS = [
  { id: "cod", label: "Cash on Delivery", desc: "Pay with cash when your order is delivered" },
  { id: "upi", label: "UPI", desc: "Google Pay, PhonePe, Paytm, BHIM" },
  { id: "card", label: "Credit / Debit Card", desc: "Visa, Mastercard, RuPay" },
];

export default function Checkout() {
  const { cartItems, cartTotal, refreshCart } = useCart();
  const { user, getSavedAddress, saveAddress } = useAuth();
  const { placeOrder } = useOrders();
  const navigate = useNavigate();

  const [address, setAddress] = useState({
    fullName: user?.name || "",
    phone: "",
    line1: "",
    city: "",
    state: "",
    pincode: "",
    lat: null,
    lng: null,
  });

  const [usingSavedAddress, setUsingSavedAddress] = useState(false);

  useEffect(() => {
    const saved = getSavedAddress();
    if (saved && saved.line1) {
      setAddress(saved);
      setUsingSavedAddress(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

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
      await saveAddress(address);
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
                      lat: null,
                      lng: null,
                    });
                    setUsingSavedAddress(false);
                  }}
                >
                  Use a different address
                </button>
              </div>
            )}
            <AddressForm
              initialAddress={address}
              onAddressChange={setAddress}
              showMap={true}
            />
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
                  <div>
                    <span className="payment-label">{pm.label}</span>
                    <span className="payment-desc">{pm.desc}</span>
                  </div>
                </label>
              ))}
            </div>
            {paymentMethod !== "cod" && (
              <p className="payment-note">
                This payment option will be available soon. Currently only Cash on Delivery is active.
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
            {placing ? "Placing Order..." : paymentMethod === "cod" ? "Place Order (COD)" : "Place Order"}
          </button>
        </div>
      </form>
    </div>
  );
}
