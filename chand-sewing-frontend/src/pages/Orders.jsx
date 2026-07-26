import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FiChevronDown, FiChevronUp } from "react-icons/fi";
import { useOrders } from "../context/OrderContext";
import { formatPrice } from "../utils/format";
import SkeletonCard from "../components/SkeletonCard";
import ErrorMessage from "../components/ErrorMessage";
import "./Orders.css";

export default function Orders() {
  const { getOrdersForUser, cancelOrder } = useOrders();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expanded, setExpanded] = useState(null);
  const [cancellingId, setCancellingId] = useState(null);
  const [confirmId, setConfirmId] = useState(null);

  useEffect(() => {
    getOrdersForUser()
      .then(setOrders)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleCancel = async (orderId) => {
    setCancellingId(orderId);
    try {
      const { order } = await cancelOrder(orderId);
      setOrders((prev) => prev.map((o) => (o._id === orderId ? order : o)));
      setConfirmId(null);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setCancellingId(null);
    }
  };

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
          const canCancel = order.status !== "Cancelled" && order.status !== "Delivered" && order.status !== "Shipped";
          const isConfirming = confirmId === order._id;
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
                  <span className={`order-status${order.status === "Cancelled" ? " cancelled" : ""}`}>{order.status}</span>
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

                  {canCancel && (
                    <div className="order-cancel-row">
                      {isConfirming ? (
                        <div className="cancel-confirm">
                          <span>Cancel this order?</span>
                          <button
                            className="cancel-yes"
                            onClick={() => handleCancel(order._id)}
                            disabled={cancellingId === order._id}
                          >
                            {cancellingId === order._id ? "Cancelling…" : "Yes, Cancel"}
                          </button>
                          <button className="cancel-no" onClick={() => setConfirmId(null)}>
                            No, Keep
                          </button>
                        </div>
                      ) : (
                        <button className="cancel-order-btn" onClick={() => setConfirmId(order._id)}>
                          Cancel Order
                        </button>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
