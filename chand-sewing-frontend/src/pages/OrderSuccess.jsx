import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { FiCheckCircle } from "react-icons/fi";
import { useOrders } from "../context/OrderContext";
import { formatPrice } from "../utils/format";
import SkeletonCard from "../components/SkeletonCard";
import "./Orders.css";

export default function OrderSuccess() {
  const { orderId } = useParams();
  const { getOrderById } = useOrders();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getOrderById(orderId)
      .then(setOrder)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orderId]);

  if (loading) {
    return (
      <div className="section-wrap">
        <SkeletonCard />
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="section-wrap empty-state">
        <h2>Order not found</h2>
        <Link to="/" className="view-all-link">Back to Home</Link>
      </div>
    );
  }

  return (
    <div className="section-wrap order-success-page">
      <div className="order-success-card">
        <FiCheckCircle size={54} color="var(--success)" />
        <h2>Order Placed Successfully!</h2>
        <p>Thank you, {order.shippingAddress.fullName}. Your order has been confirmed.</p>

        <div className="order-success-meta">
          <div>
            <span>Order ID</span>
            <strong>{order._id}</strong>
          </div>
          <div>
            <span>Total</span>
            <strong>{formatPrice(order.total)}</strong>
          </div>
          <div>
            <span>Payment</span>
            <strong>{order.status}</strong>
          </div>
        </div>

        <div className="order-items-list">
          {order.items.map((item, i) => (
            <div className="order-item-row" key={item.product || i}>
              <img src={item.image} alt={item.title} />
              <div>
                <p className="order-item-title">{item.title}</p>
                <span className="product-category">Qty: {item.qty}</span>
              </div>
              <span className="order-item-price">{formatPrice(item.price * item.qty)}</span>
            </div>
          ))}
        </div>

        <div className="order-success-actions">
          <Link to="/orders" className="btn-view-full">View My Orders</Link>
          <Link to="/shop" className="btn-buy-now">Continue Shopping</Link>
        </div>
      </div>
    </div>
  );
}
