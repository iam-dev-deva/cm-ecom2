import { HeartOutlined, ShareAltOutlined } from '@ant-design/icons';
import { ImageLoader } from '@/components/common';
import PropType from 'prop-types';
import React, { useState } from 'react';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import { useHistory } from 'react-router-dom';

const ProductFeatured = ({ product }) => {
  const history = useHistory();
  const [isFavorited, setIsFavorited] = useState(false);

  const onClickItem = () => {
    if (!product) return;

    history.push(`/product/${product.ProductID}/${product.ProductCode || ''}`);
  };

  const handleFavorite = (e) => {
    e.stopPropagation();
    setIsFavorited(!isFavorited);
  };

  const handleShare = (e) => {
    e.stopPropagation();
    if (navigator.share) {
      navigator.share({
        title: product.ItemName,
        url: window.location.href
      });
    }
  };

  const discountPercent = product.MRP && product.Rate
    ? Math.round(((product.MRP - product.Rate) / product.MRP) * 100)
    : null;

  return (
    <SkeletonTheme color="#e1e1e1" highlightColor="#f2f2f2">
      <div className="product-display" onClick={onClickItem} role="presentation">
        <div className="product-display-header">
          <button
            className={`product-display-action-btn ${isFavorited ? 'favorited' : ''}`}
            onClick={handleFavorite}
            type="button"
            aria-label="Add to favorites"
          >
            <HeartOutlined />
          </button>
          <button
            className="product-display-action-btn"
            onClick={handleShare}
            type="button"
            aria-label="Share product"
          >
            <ShareAltOutlined />
          </button>
        </div>

        <div className="product-display-img">
          {product.FrontImageFile ? (
            <ImageLoader
              className="product-card-img"
              src={product.FrontImageFile}
            />
          ) : <Skeleton width="100%" height="100%" />}
        </div>

        {discountPercent && (
          <div className="product-display-badge">
            {discountPercent}% OFF!
          </div>
        )}

        <div className="product-display-details">
          <h5 className="product-display-name">
            {product.ItemName || <Skeleton width={80} />}
          </h5>
          <p className="product-display-brand">
            {product.BrandName || <Skeleton width={60} />}
          </p>
          <div className="product-display-pricing">
            {product.MRP && (
              <span className="product-display-mrp">
                ₹{product.MRP.toFixed(2)}
              </span>
            )}
            <h4 className="product-display-price">
              ₹ {product.Rate || <Skeleton width={40} />}
            </h4>
          </div>
        </div>
      </div>
    </SkeletonTheme>
  );
};

ProductFeatured.propTypes = {
  product: PropType.shape({
    FrontImageFile: PropType.string,
    ItemName: PropType.string,
    ProductID: PropType.number,
    BrandName: PropType.string,
    MRP: PropType.number,
    Rate: PropType.number,
    ProductCode: PropType.string
  }).isRequired
};

export default ProductFeatured;
