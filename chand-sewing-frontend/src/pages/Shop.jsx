import React, { useEffect, useMemo, useState } from "react";
import useProducts from "../hooks/useProducts";
import ShopSidebar from "../components/ShopSidebar";
import ProductCard from "../components/ProductCard";
import SkeletonCard from "../components/SkeletonCard";
import ErrorMessage from "../components/ErrorMessage";
import Pagination from "../components/Pagination";
import { useSearch } from "../context/SearchContext";
import "./Shop.css";

const PAGE_SIZE = 9;

export default function Shop() {
  const { products, loading, error } = useProducts();
  const { searchQuery } = useSearch();

  const [selectedCategory, setSelectedCategory] = useState("");
  const [priceRange, setPriceRange] = useState(0);
  const [minRating, setMinRating] = useState(0);
  const [keyword, setKeyword] = useState("");
  const [sortBy, setSortBy] = useState("relevance");
  const [page, setPage] = useState(1);

  // Keep the sidebar search box in sync with the header search bar
  useEffect(() => {
    if (searchQuery) setKeyword(searchQuery);
  }, [searchQuery]);

  const categories = useMemo(
    () => [...new Set(products.map((p) => p.category))],
    [products]
  );

  const maxPrice = useMemo(
    () => (products.length ? Math.ceil(Math.max(...products.map((p) => p.price))) : 1000),
    [products]
  );

  useEffect(() => {
    if (maxPrice) setPriceRange(maxPrice);
  }, [maxPrice]);

  const filtered = useMemo(() => {
    let list = [...products];

    if (selectedCategory) list = list.filter((p) => p.category === selectedCategory);
    if (priceRange) list = list.filter((p) => p.price <= priceRange);
    if (minRating) list = list.filter((p) => p.rating >= minRating);
    if (keyword.trim()) {
      const q = keyword.trim().toLowerCase();
      list = list.filter(
        (p) =>
          p.title.toLowerCase().includes(q) || p.category.toLowerCase().includes(q)
      );
    }

    switch (sortBy) {
      case "price_low":
        list.sort((a, b) => a.price - b.price);
        break;
      case "price_high":
        list.sort((a, b) => b.price - a.price);
        break;
      case "rating":
        list.sort((a, b) => b.rating - a.rating);
        break;
      case "discount":
        list.sort((a, b) => b.discountPercent - a.discountPercent);
        break;
      default:
        break;
    }

    return list;
  }, [products, selectedCategory, priceRange, minRating, keyword, sortBy]);

  useEffect(() => setPage(1), [selectedCategory, priceRange, minRating, keyword, sortBy]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const clearFilters = () => {
    setSelectedCategory("");
    setPriceRange(maxPrice);
    setMinRating(0);
    setKeyword("");
    setSortBy("relevance");
  };

  return (
    <div className="section-wrap shop-page">
      <div className="section-heading">
        <div>
          <h2>Shop</h2>
          <p>{loading ? "Loading products..." : `${filtered.length} products found`}</p>
        </div>
        <select
          className="sort-select"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
        >
          <option value="relevance">Sort: Relevance</option>
          <option value="price_low">Price: Low to High</option>
          <option value="price_high">Price: High to Low</option>
          <option value="rating">Rating</option>
          <option value="discount">Discount</option>
        </select>
      </div>

      <div className="shop-layout">
        <ShopSidebar
          categories={categories}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
          priceRange={priceRange}
          onPriceChange={setPriceRange}
          maxPrice={maxPrice}
          minRating={minRating}
          onRatingChange={setMinRating}
          keyword={keyword}
          onKeywordChange={setKeyword}
          onClearFilters={clearFilters}
        />

        <div className="shop-results">
          {error ? (
            <ErrorMessage message={error} />
          ) : (
            <>
              <div className="product-grid">
                {loading
                  ? Array.from({ length: 9 }).map((_, i) => <SkeletonCard key={i} />)
                  : paginated.map((p) => <ProductCard key={p.id} product={p} />)}
              </div>
              {!loading && paginated.length === 0 && (
                <p className="no-results">No products match your filters.</p>
              )}
              <Pagination
                currentPage={page}
                totalPages={totalPages}
                onPageChange={setPage}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
