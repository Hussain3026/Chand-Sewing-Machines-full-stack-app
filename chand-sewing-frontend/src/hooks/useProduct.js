import { useEffect, useState } from "react";
import { getProductById } from "../services/productService";

export default function useProduct(id) {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    setProduct(null);
    getProductById(id)
      .then((data) => {
        if (isMounted) setProduct(data);
      })
      .catch((err) => {
        if (isMounted) setError(err.message || "Failed to load product.");
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });
    return () => {
      isMounted = false;
    };
  }, [id]);

  return { product, loading, error };
}
