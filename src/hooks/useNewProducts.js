import { useCallback, useEffect, useState } from 'react';
import productService from '@/services/productService';
import useDidMount from './useDidMount';

const useNewProducts = (itemsCount = 20) => {
  const [newProducts, setNewProducts] = useState([]);
  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const didMount = useDidMount(true);

  const fetchNewProducts = useCallback(async () => {
    try {
      setLoading(true);
      setError('');

      const apiData = await productService.getDashboardData();
      const items = apiData?.data?.NewArrivals || [];

      if (didMount) {
        setNewProducts(items.slice(0, itemsCount));
        setLoading(false);
      }
    } catch (e) {
      if (didMount) {
        setNewProducts([]);
        setError('Failed to fetch featured products');
        setLoading(false);
      }
    }
  }, [didMount, itemsCount]);

  useEffect(() => {
    if (didMount && newProducts.length === 0) {
      fetchNewProducts();
    }
  }, [didMount, newProducts.length, fetchNewProducts]);

  return {
    newProducts,
    fetchNewProducts,
    isLoading,
    error
  };
};

export default useNewProducts;
