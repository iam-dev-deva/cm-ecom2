import { useCallback, useEffect, useState } from 'react';
import productService from '@/services/productService';
import useDidMount from './useDidMount';

const useFeaturedProducts = (itemsCount = 6) => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const didMount = useDidMount(true);

  const fetchFeaturedProducts = useCallback(async () => {
    try {
      setLoading(true);
      setError('');

      const apiData = await productService.getDashboardData();
      const items = apiData?.data?.PopularProducts || [];

      if (didMount) {
        setFeaturedProducts(items.slice(0, itemsCount));
        setLoading(false);
      }
    } catch (e) {
      if (didMount) {
        setFeaturedProducts([]);
        setError('Failed to fetch featured products');
        setLoading(false);
      }
    }
  }, [didMount, itemsCount]);

  useEffect(() => {
    if (didMount && featuredProducts.length === 0) {
      fetchFeaturedProducts();
    }
  }, [didMount, featuredProducts.length, fetchFeaturedProducts]);

  return {
    featuredProducts,
    fetchFeaturedProducts,
    isLoading,
    error
  };
};

export default useFeaturedProducts;
