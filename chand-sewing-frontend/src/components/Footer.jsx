import React from "react";
import { Link } from "react-router-dom";
import { FiPhone, FiMail, FiMapPin } from "react-icons/fi";
import "./Footer.css";

export default function Footer() {
  return (
    <footer className="csm-footer">
      <div className="csm-footer-grid">
        <div>
          <h4>Chand Sewing Machines</h4>
          <p>Trusted sewing, embroidery and overlock machines for tailors and garment units.</p>
        </div>
        <div>
          <h4>Quick Links</h4>
          <Link to="/">Home</Link>
          <Link to="/shop">Shop</Link>
          <Link to="/about">About</Link>
          <Link to="/contact">Contact Us</Link>
        </div>
        <div>
          <h4>My Account</h4>
          <Link to="/cart">Cart</Link>
          <Link to="/wishlist">Wishlist</Link>
        </div>
        <div>
          <h4>Get in Touch</h4>
          <p><FiMapPin /> Tadipatri, Andhra Pradesh, India</p>
          <p><FiPhone /> +91 9948116087</p>
          <p><FiMail /> support@chandsewing.com</p>
        </div>
      </div>
      <div className="csm-footer-bottom">
        © {new Date().getFullYear()} Chand Sewing Machines. All rights reserved.
      </div>
    </footer>
  );
}
