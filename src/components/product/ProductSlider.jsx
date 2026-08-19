import { FeaturedProduct } from '@/components/product';
import PropType from 'prop-types';
import React, { useRef } from 'react';

const ProductSlider = ({
  products,
  skeletonCount = 4,
  isLoading = false
}) => {
  const safeProducts = Array.isArray(products) ? products : [];
  const showSkeletons = isLoading || safeProducts.length === 0;
  const sliderRef = useRef(null);

  const scrollSlider = (direction) => {
    if (!sliderRef.current) return;

    const amount = 320;
    sliderRef.current.scrollBy({
      left: direction === 'next' ? amount : -amount,
      behavior: 'smooth'
    });
  };

  const renderProducts = () => {
    if (showSkeletons) {
      return new Array(skeletonCount).fill({}).map((product, index) => (
        <FeaturedProduct
          key={`product-skeleton-${index}`}
          product={product}
        />
      ));
    }

    return safeProducts.map((product, index) => (
      <FeaturedProduct
        key={product.ItemName || product.ProductName || `product-${index}`}
        product={product}
      />
    ));
  };

  return (
    <div className="product-slider-wrapper">
      <button
        type="button"
        className="product-slider-arrow product-slider-arrow-left"
        onClick={() => scrollSlider('prev')}
        aria-label="Scroll products left"
      >
        ‹
      </button>

      <div ref={sliderRef} className="product-slider-track">
        {renderProducts()}
      </div>

      <button
        type="button"
        className="product-slider-arrow product-slider-arrow-right"
        onClick={() => scrollSlider('next')}
        aria-label="Scroll products right"
      >
        ›
      </button>
    </div>
  );
};

ProductSlider.propTypes = {
  products: PropType.array.isRequired,
  skeletonCount: PropType.number,
  isLoading: PropType.bool
};

export default ProductSlider;
