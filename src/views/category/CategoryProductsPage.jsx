import { MessageDisplay } from '@/components/common';
import { ProductShowcaseGrid } from '@/components/product';
import { useDocumentTitle, useScrollTop } from '@/hooks';
import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import productService from '@/services/productService';
import { HOME } from '@/constants/routes';

const CategoryProductsPage = () => {
  const { categoryId, categoryName } = useParams();
  const [products, setProducts] = useState([]);
  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const normalizedCategoryName = decodeURIComponent(categoryName || 'Category');

  useDocumentTitle(`${normalizedCategoryName} | ARUDRA`);
  useScrollTop();

  useEffect(() => {
    const loadCategoryProducts = async () => {
      try {
        setLoading(true);
        setError('');

        const categoryKey = categoryId || decodeURIComponent(categoryName || '');
        const items = await productService.getProductsByCategory(categoryKey, 24);
        setProducts(items || []);
      } catch (e) {
        setError(e?.message || 'Failed to load category products');
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    if (categoryId || categoryName) {
      loadCategoryProducts();
    }
  }, [categoryId, categoryName]);

  return (
    <main className="content">
      <div className="featured">
        <div className="banner">
          <div className="banner-desc">
            <h1>{normalizedCategoryName}</h1>
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
                isLoading={isLoading}
              />
            )}
          </div>
        </div>
      </div>
    </main>
  );
};

export default CategoryProductsPage;
