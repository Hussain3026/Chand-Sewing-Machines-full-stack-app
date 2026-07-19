import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FiChevronDown, FiChevronUp } from "react-icons/fi";
import { useOrders } from "../context/OrderContext";
import { formatPrice } from "../utils/format";
import SkeletonCard from "../components/SkeletonCard";
import ErrorMessage from "../components/ErrorMessage";
import "./Orders.css";

export default function Orders() {
  const { getOrdersForUser } = useOrders();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expanded, setExpanded] = useState(null);

  useEffect(() => {
    getOrdersForUser()
      .then(setOrders)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading) {
    return (
      <div className="section-wrap">
        <SkeletonCard />
      </div>
    );
  }

  if (error) {
    return (
      <div className="section-wrap">
        <ErrorMessage message={error} />
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="section-wrap empty-state">
        <h2>No orders yet</h2>
        <p>Everything you order will show up here.</p>
        <Link to="/shop" className="view-all-link">Start Shopping</Link>
      </div>
    );
  }

  return (
    <div className="section-wrap">
      <div className="section-heading">
        <h2>My Orders ({orders.length})</h2>
      </div>

      <div className="orders-list">
        {orders.map((order) => {
          const isOpen = expanded === order._id;
          return (
            <div className="order-card" key={order._id}>
              <button className="order-card-header" onClick={() => setExpanded(isOpen ? null : order._id)}>
                <div>
                  <strong>{order._id}</strong>
                  <span className="order-date">
                    {new Date(order.createdAt).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </span>
                </div>
                <div className="order-card-header-right">
                  <span className="order-status">{order.status}</span>
                  <span className="order-total">{formatPrice(order.total)}</span>
                  {isOpen ? <FiChevronUp /> : <FiChevronDown />}
                </div>
              </button>

              {isOpen && (
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
                  <div className="order-address">
                    <strong>Shipped to:</strong>{" "}
                    {order.shippingAddress.fullName}, {order.shippingAddress.line1},{" "}
                    {order.shippingAddress.city}, {order.shippingAddress.state} -{" "}
                    {order.shippingAddress.pincode}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
