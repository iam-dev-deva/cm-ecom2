import { MessageDisplay } from '@/components/common';
import { ProductShowcaseGrid } from '@/components/product';
import { useDocumentTitle, useScrollTop } from '@/hooks';
import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import productService from '@/services/productService';
import { HOME } from '@/constants/routes';

const CategoryProductsPage = () => {
  const { categoryName } = useParams();
  const [products, setProducts] = useState([]);
  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useDocumentTitle(`${decodeURIComponent(categoryName || 'Category')} | ARUDRA`);
  useScrollTop();

  useEffect(() => {
    const loadCategoryProducts = async () => {
      try {
        setLoading(true);
        setError('');
        const items = await productService.getProductsByCategory(decodeURIComponent(categoryName || ''), 24);
        setProducts(items || []);
      } catch (e) {
        setError(e?.message || 'Failed to load category products');
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    if (categoryName) {
      loadCategoryProducts();
    }
  }, [categoryName]);

  return (
    <main className="content">
      <div className="featured">
        <div className="banner">
          <div className="banner-desc">
            <h1>{decodeURIComponent(categoryName || 'Category')}</h1>
            <p>Products in this category</p>
            <br />
            <Link to={HOME} className="button">
              Back to Home
            </Link>
          </div>
        </div>
        <div className="display">
          <div className="product-display-grid">
            {error && !isLoading ? (
              <MessageDisplay
                message={error}
                buttonLabel="Try Again"
              />
            ) : (
              <ProductShowcaseGrid
                products={products}
                skeletonCount={6}
              />
            )}
          </div>
        </div>
      </div>
    </main>
  );
};

export default CategoryProductsPage;
