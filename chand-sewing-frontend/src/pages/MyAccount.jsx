import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FiUser, FiLock, FiPackage, FiHeart, FiMapPin } from "react-icons/fi";
import { useAuth } from "../context/AuthContext";
import { useOrders } from "../context/OrderContext";
import { useWishlist } from "../context/WishlistContext";
import ProductCard from "../components/ProductCard";
import { formatPrice } from "../utils/format";
import "./MyAccount.css";

const TABS = [
  { id: "profile", label: "Profile", icon: FiUser },
  { id: "address", label: "Saved Address", icon: FiMapPin },
  { id: "password", label: "Password", icon: FiLock },
  { id: "wishlist", label: "Wishlist", icon: FiHeart },
  { id: "orders", label: "Recent Orders", icon: FiPackage },
];

export default function MyAccount() {
  const { user, updateProfile, changePassword, getSavedAddress, saveAddress } = useAuth();
  const { getOrdersForUser } = useOrders();
  const { wishlistItems } = useWishlist();

  const [recentOrders, setRecentOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(true);

  useEffect(() => {
    getOrdersForUser()
      .then((orders) => setRecentOrders(orders.slice(0, 3)))
      .catch(() => setRecentOrders([]))
      .finally(() => setOrdersLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [activeTab, setActiveTab] = useState("profile");

  return (
    <div className="section-wrap account-page">
      <div className="section-heading">
        <h2>My Account</h2>
      </div>

      <div className="account-layout">
        <aside className="account-tabs">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                className={activeTab === tab.id ? "active" : ""}
                onClick={() => setActiveTab(tab.id)}
              >
                <Icon size={16} /> {tab.label}
              </button>
            );
          })}
        </aside>

        <div className="account-content">
          {activeTab === "profile" && <ProfileTab user={user} updateProfile={updateProfile} />}
          {activeTab === "address" && (
            <AddressTab
              user={user}
              getSavedAddress={getSavedAddress}
              saveAddress={saveAddress}
            />
          )}
          {activeTab === "password" && <PasswordTab changePassword={changePassword} />}
          {activeTab === "wishlist" && <WishlistTab items={wishlistItems} />}
          {activeTab === "orders" && (
            <OrdersTab orders={recentOrders} loading={ordersLoading} />
          )}
        </div>
      </div>
    </div>
  );
}

function ProfileTab({ user, updateProfile }) {
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [status, setStatus] = useState(null); // { type: 'success' | 'error', message }
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus(null);
    setSaving(true);
    try {
      await updateProfile({ name, email });
      setStatus({ type: "success", message: "Profile updated successfully." });
    } catch (err) {
      setStatus({ type: "error", message: err.message });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="account-card">
      <h4>Profile Details</h4>
      <form className="auth-form" onSubmit={handleSubmit}>
        <label>
          Full Name
          <input value={name} onChange={(e) => setName(e.target.value)} required />
        </label>
        <label>
          Email
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </label>

        {status && (
          <p className={status.type === "success" ? "account-success" : "auth-error"}>
            {status.message}
          </p>
        )}

        <button type="submit" className="btn-buy-now auth-submit" disabled={saving}>
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </form>
    </div>
  );
}

function PasswordTab({ changePassword }) {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [status, setStatus] = useState(null);
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus(null);

    if (newPassword.length < 6) {
      setStatus({ type: "error", message: "New password must be at least 6 characters." });
      return;
    }
    if (newPassword !== confirmPassword) {
      setStatus({ type: "error", message: "New passwords do not match." });
      return;
    }

    setSaving(true);
    try {
      await changePassword({ currentPassword, newPassword });
      setStatus({ type: "success", message: "Password changed successfully." });
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      setStatus({ type: "error", message: err.message });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="account-card">
      <h4>Change Password</h4>
      <form className="auth-form" onSubmit={handleSubmit}>
        <label>
          Current Password
          <input
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            required
          />
        </label>
        <label>
          New Password
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
        </label>
        <label>
          Confirm New Password
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </label>

        {status && (
          <p className={status.type === "success" ? "account-success" : "auth-error"}>
            {status.message}
          </p>
        )}

        <button type="submit" className="btn-buy-now auth-submit" disabled={saving}>
          {saving ? "Saving..." : "Change Password"}
        </button>
      </form>
    </div>
  );
}

function AddressTab({ user, getSavedAddress, saveAddress }) {
  const existing = getSavedAddress();
  const [form, setForm] = useState(
    existing || {
      fullName: user.name || "",
      phone: "",
      line1: "",
      city: "",
      state: "",
      pincode: "",
    }
  );
  const [status, setStatus] = useState(null);

  const updateField = (field, value) => setForm((prev) => ({ ...prev, [field]: value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!/^\d{10}$/.test(form.phone)) {
      setStatus({ type: "error", message: "Enter a valid 10-digit phone number." });
      return;
    }
    if (!/^\d{6}$/.test(form.pincode)) {
      setStatus({ type: "error", message: "Enter a valid 6-digit pincode." });
      return;
    }
    try {
      await saveAddress(form);
      setStatus({ type: "success", message: "Address saved. It will auto-fill at checkout." });
    } catch (err) {
      setStatus({ type: "error", message: err.message });
    }
  };

  return (
    <div className="account-card">
      <h4>Saved Address</h4>
      <p className="account-empty" style={{ marginBottom: 16 }}>
        This address auto-fills at checkout so you don't have to re-type it every order.
      </p>
      <form className="auth-form" onSubmit={handleSubmit}>
        <label>
          Full Name
          <input value={form.fullName} onChange={(e) => updateField("fullName", e.target.value)} required />
        </label>
        <label>
          Phone Number
          <input value={form.phone} onChange={(e) => updateField("phone", e.target.value)} required />
        </label>
        <label>
          Address
          <input value={form.line1} onChange={(e) => updateField("line1", e.target.value)} required />
        </label>
        <label>
          City
          <input value={form.city} onChange={(e) => updateField("city", e.target.value)} required />
        </label>
        <label>
          State
          <input value={form.state} onChange={(e) => updateField("state", e.target.value)} required />
        </label>
        <label>
          Pincode
          <input value={form.pincode} onChange={(e) => updateField("pincode", e.target.value)} required />
        </label>

        {status && (
          <p className={status.type === "success" ? "account-success" : "auth-error"}>
            {status.message}
          </p>
        )}

        <button type="submit" className="btn-buy-now auth-submit">
          Save Address
        </button>
      </form>
    </div>
  );
}

function WishlistTab({ items }) {
  if (items.length === 0) {
    return (
      <div className="account-card">
        <h4>Wishlist</h4>
        <p className="account-empty">You haven't added anything to your wishlist yet.</p>
        <Link to="/shop" className="view-all-link">Browse Products</Link>
      </div>
    );
  }

  return (
    <div className="account-card account-card-wide">
      <h4>Wishlist ({items.length})</h4>
      <div className="product-grid account-wishlist-grid">
        {items.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </div>
  );
}

function OrdersTab({ orders, loading }) {
  if (loading) {
    return (
      <div className="account-card">
        <h4>Recent Orders</h4>
        <p className="account-empty">Loading...</p>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="account-card">
        <h4>Recent Orders</h4>
        <p className="account-empty">You haven't placed any orders yet.</p>
        <Link to="/shop" className="view-all-link">Start Shopping</Link>
      </div>
    );
  }

  return (
    <div className="account-card">
      <h4>Recent Orders</h4>
      <div className="account-orders-list">
        {orders.map((order) => (
          <div className="account-order-row" key={order._id}>
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
            <span className="order-status">{order.status}</span>
            <span className="order-total">{formatPrice(order.total)}</span>
          </div>
        ))}
      </div>
      <Link to="/orders" className="view-all-link" style={{ marginTop: 16, display: "inline-block" }}>
        View All Orders →
      </Link>
    </div>
  );
}
