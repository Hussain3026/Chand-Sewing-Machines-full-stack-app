import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FiSearch,
  FiUser,
  FiShoppingCart,
  FiChevronDown,
  FiMenu,
  FiHome,
  FiShoppingBag,
  FiGrid,
  FiInfo,
} from "react-icons/fi";
import { GiSewingMachine, GiScissors } from "react-icons/gi";
import { BiSupport } from "react-icons/bi";
import { useCart } from "../context/CartContext";
import { useSearch } from "../context/SearchContext";
import { useAuth } from "../context/AuthContext";
import CountryDropdown from "./CountryDropdown";
import "./Header.css";

const CATEGORIES = [
  "Sewing Machines",
  "Embroidery Machines",
  "Overlock Machines",
  "Spare Parts",
  "Accessories",
];

export default function Header() {
  const navigate = useNavigate();
  const { cartCount } = useCart();
  const { searchQuery, setSearchQuery } = useSearch();
  const { user, isAuthenticated, logout } = useAuth();

  const [loginOpen, setLoginOpen] = useState(false);
  const [categoriesOpen, setCategoriesOpen] = useState(false);

  const runSearch = () => navigate("/shop");

  return (
    <header className="csm-header">
      <div className="csm-topbar">Welcome to our store!</div>

      <div className="csm-header-main">
        <Link to="/" className="csm-logo">
          <div className="csm-logo-badge">
            <GiSewingMachine size={30} />
          </div>
          <span>Chand Sewing Machines</span>
        </Link>

        <CountryDropdown />

        <div className="csm-search">
          <input
            type="text"
            placeholder="Search for Product..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && runSearch()}
          />
          <button onClick={runSearch} aria-label="Search">
            <FiSearch size={18} />
          </button>
        </div>

        <div className="csm-login" onClick={() => setLoginOpen((o) => !o)}>
          <FiUser size={20} />
          <span>
            {isAuthenticated ? user.name.split(" ")[0] : "Login"} <FiChevronDown size={12} />
          </span>
          {loginOpen && (
            <ul className="csm-dropdown-list">
              {isAuthenticated ? (
                <>
                  <li className="csm-dropdown-heading">Hi, {user.name}</li>
                  <li
                    onClick={() => {
                      setLoginOpen(false);
                      navigate("/account");
                    }}
                  >
                    My Account
                  </li>
                  <li
                    onClick={() => {
                      setLoginOpen(false);
                      navigate("/orders");
                    }}
                  >
                    Orders
                  </li>
                  <li
                    onClick={() => {
                      logout();
                      setLoginOpen(false);
                      navigate("/");
                    }}
                  >
                    Logout
                  </li>
                </>
              ) : (
                <>
                  <li
                    onClick={() => {
                      setLoginOpen(false);
                      navigate("/login");
                    }}
                  >
                    Login
                  </li>
                  <li
                    onClick={() => {
                      setLoginOpen(false);
                      navigate("/register");
                    }}
                  >
                    Register
                  </li>
                </>
              )}
            </ul>
          )}
        </div>

        <Link to="/cart" className="csm-cart">
          <FiShoppingCart size={22} />
          <span className="csm-cart-badge">{cartCount}</span>
          <span className="csm-cart-label">Cart</span>
        </Link>
      </div>

      <div className="csm-navbar">
        <div
          className="csm-all-categories"
          onClick={() => setCategoriesOpen((o) => !o)}
        >
          <FiMenu size={16} /> ALL CATEGORIES <FiChevronDown size={14} />
          {categoriesOpen && (
            <ul className="csm-dropdown-list csm-categories-list">
              {CATEGORIES.map((cat) => (
                <li key={cat} onClick={() => navigate("/shop")}>
                  {cat}
                </li>
              ))}
            </ul>
          )}
        </div>

        <nav className="csm-nav-links">
          <Link to="/">
            <FiHome /> Home
          </Link>
          <Link to="/shop">
            <FiShoppingBag /> Shop
          </Link>
          <Link to="/shop">
            <FiGrid /> Categories
          </Link>
          <Link to="/shop">
            <GiScissors /> Accessories
          </Link>
          <Link to="/about">
            <FiInfo /> About
          </Link>
          <Link to="/contact">
            <BiSupport /> Contact Us
          </Link>
        </nav>
      </div>
    </header>
  );
}
