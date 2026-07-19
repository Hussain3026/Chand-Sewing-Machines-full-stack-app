import React, { useMemo } from "react";
import useProducts from "../hooks/useProducts";
import ProductSection from "../components/ProductSection";
import Banner from "../components/Banner";

export default function Home() {
  const { products, loading, error } = useProducts();

  const bestSellers = useMemo(() => products.slice(0, 8), [products]);
  const newArrivals = useMemo(() => products.slice(8, 16), [products]);
  const featured = useMemo(() => products.slice(16), [products]);

  return (
    <div className="home-page">
      <Banner />
      <ProductSection
        title="Best Sellers"
        subtitle="Check out our most popular products!"
        products={bestSellers}
        loading={loading}
        error={error}
      />

      <ProductSection
        title="New Arrivals"
        subtitle="Fresh additions to our catalogue"
        products={newArrivals}
        loading={loading}
        error={error}
      />

      <ProductSection
        title="Featured Products"
        subtitle="Handpicked machines and accessories"
        products={featured}
        loading={loading}
        error={error}
      />
    </div>
  );
}
