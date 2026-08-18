/* eslint-disable react/forbid-prop-types */
import { FeaturedProduct } from '@/components/product';
import PropType from 'prop-types';
import React from 'react';

const ProductShowcase = ({
  products,
  skeletonCount = 4,
  isLoading = false
}) => {
  const safeProducts = Array.isArray(products) ? products : [];
  const showSkeletons = isLoading || safeProducts.length === 0;

  return (
    <div className="product-display-grid">
      {showSkeletons ? new Array(skeletonCount).fill({}).map((product, index) => (
        <FeaturedProduct
          // eslint-disable-next-line react/no-array-index-key
          key={`product-skeleton ${index}`}
          product={product}
        />
      )) : safeProducts.map((product) => (
        <FeaturedProduct
          key={product.ItemName || `product-${Math.random()}`}
          product={product}
        />
      ))}
    </div>
  );
};

ProductShowcase.propTypes = {
  products: PropType.array.isRequired,
  skeletonCount: PropType.number,
  isLoading: PropType.bool
};

export default ProductShowcase;
