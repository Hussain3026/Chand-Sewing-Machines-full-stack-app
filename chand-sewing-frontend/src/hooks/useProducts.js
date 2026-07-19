import { useEffect, useState } from "react";
import { getAllProducts } from "../services/productService";

/**
 * Fetches the full product list once and exposes it with
 * loading / error state. Pages slice/filter this as needed.
 */
export default function useProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    getAllProducts()
      .then((data) => {
        if (isMounted) setProducts(data);
      })
      .catch((err) => {
        if (isMounted) setError(err.message || "Failed to load products.");
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });
    return () => {
      isMounted = false;
    };
  }, []);

  return { products, loading, error };
}
