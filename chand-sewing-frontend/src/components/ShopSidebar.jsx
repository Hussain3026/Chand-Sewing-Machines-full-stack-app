import React from "react";

export default function ShopSidebar({
  categories,
  selectedCategory,
  onCategoryChange,
  priceRange,
  onPriceChange,
  maxPrice,
  minRating,
  onRatingChange,
  keyword,
  onKeywordChange,
  onClearFilters,
}) {
  return (
    <aside className="shop-sidebar">
      <div className="filter-block">
        <h4>Search</h4>
        <input
          type="text"
          className="filter-search-input"
          placeholder="Search products..."
          value={keyword}
          onChange={(e) => onKeywordChange(e.target.value)}
        />
      </div>

      <div className="filter-block">
        <h4>Categories</h4>
        <ul className="filter-list">
          <li>
            <button
              className={!selectedCategory ? "active" : ""}
              onClick={() => onCategoryChange("")}
            >
              All Categories
            </button>
          </li>
          {categories.map((cat) => (
            <li key={cat}>
              <button
                className={selectedCategory === cat ? "active" : ""}
                onClick={() => onCategoryChange(cat)}
              >
                {cat}
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div className="filter-block">
        <h4>Price Range</h4>
        <input
          type="range"
          min={0}
          max={maxPrice}
          value={priceRange}
          onChange={(e) => onPriceChange(Number(e.target.value))}
          className="price-slider"
        />
        <div className="price-range-labels">
          <span>₹0</span>
          <span>Up to ₹{priceRange.toLocaleString("en-IN")}</span>
        </div>
      </div>

      <div className="filter-block">
        <h4>Rating</h4>
        <ul className="filter-list">
          {[4, 3, 2, 1].map((r) => (
            <li key={r}>
              <button
                className={minRating === r ? "active" : ""}
                onClick={() => onRatingChange(minRating === r ? 0 : r)}
              >
                {r}★ & above
              </button>
            </li>
          ))}
        </ul>
      </div>

      <button className="btn-clear-filters" onClick={onClearFilters}>
        Clear All Filters
      </button>
    </aside>
  );
}
