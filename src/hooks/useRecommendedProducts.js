import { useCallback, useEffect, useState } from 'react';
import productService from '@/services/productService';
import useDidMount from './useDidMount';

const useRecommendedProducts = (itemsCount = 6) => {
  const [recommendedProducts, setRecommendedProducts] = useState([]);
  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const didMount = useDidMount(true);

  const fetchRecommendedProducts = useCallback(async () => {
    try {
      setLoading(true);
      setError('');

      const apiData = await productService.getDashboardData();
      const items = apiData?.data?.NewArrivals || [];
      // const items = await productService.getRecommendedProducts(itemsCount);

      if (didMount) {
        setRecommendedProducts(items || []);
        setLoading(false);
      }
    } catch (e) {
      if (didMount) {
        setRecommendedProducts([]);
        setError('Failed to fetch recommended products');
        setLoading(false);
      }
    }
  }, [didMount, itemsCount]);

  useEffect(() => {
    if (didMount && recommendedProducts.length === 0) {
      fetchRecommendedProducts();
    }
  }, [didMount, fetchRecommendedProducts, recommendedProducts.length]);

  return {
    recommendedProducts,
    fetchRecommendedProducts,
    isLoading,
    error
  };
};

export default useRecommendedProducts;
