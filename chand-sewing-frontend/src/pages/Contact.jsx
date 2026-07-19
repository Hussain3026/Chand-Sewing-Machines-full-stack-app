import React, { useState } from "react";

export default function Contact() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="section-wrap">
      <div className="section-heading">
        <h2>Contact Us</h2>
      </div>
      {submitted ? (
        <p style={{ color: "var(--success)", fontWeight: 600 }}>
          Thanks! We'll get back to you shortly.
        </p>
      ) : (
        <form onSubmit={handleSubmit} style={{ maxWidth: 480, display: "flex", flexDirection: "column", gap: 12 }}>
          <input className="filter-search-input" placeholder="Your Name" required />
          <input className="filter-search-input" placeholder="Your Email" type="email" required />
          <textarea className="filter-search-input" placeholder="Message" rows={5} required />
          <button className="btn-buy-now" type="submit">Send Message</button>
        </form>
      )}
    </div>
  );
}
