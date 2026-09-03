// src/hooks/useProducts.js
import { useEffect, useState } from 'react';
import { fetchProducts } from '../services/firebase/firestore';
import { MOCK_PRODUCTS } from '../data/mockProducts';

export function useProducts() {
  const [products, setProducts] = useState(MOCK_PRODUCTS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    fetchProducts()
      .then((remote) => {
        if (isMounted && remote && remote.length) setProducts(remote);
      })
      .catch(() => {})
      .finally(() => {
        if (isMounted) setLoading(false);
      });
    return () => {
      isMounted = false;
    };
  }, []);

  return { products, loading };
}
