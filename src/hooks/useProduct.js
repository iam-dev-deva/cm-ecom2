import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import productService from '@/services/productService';
import useDidMount from './useDidMount';

const useProduct = (id) => {
  const storeProduct = useSelector((state) => state.products.items.find((item) => item.id === id));

  const [product, setProduct] = useState(storeProduct);
  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const didMount = useDidMount(true);

  useEffect(() => {
    const loadProduct = async () => {
      try {
        if (storeProduct && storeProduct.id === id) {
          setProduct(storeProduct);
          return;
        }

        setLoading(true);
        setError(null);
        const data = await productService.getSingleProduct(id);

        if (didMount) {
          setProduct(data || null);
          setLoading(false);
        }
      } catch (err) {
        if (didMount) {
          setLoading(false);
          setError(err?.message || 'Something went wrong.');
        }
      }
    };

    loadProduct();
  }, [didMount, id, storeProduct]);

  return { product, isLoading, error };
};

export default useProduct;
