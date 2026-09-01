import { ArrowRightOutlined } from '@ant-design/icons';
import { MessageDisplay, FeaturesSection } from '@/components/common';
import { ProductSlider } from '@/components/product';
import { FEATURED_PRODUCTS, RECOMMENDED_PRODUCTS, SHOP, NEW_PRODUCTS } from '@/constants/routes';
import { IMAGES } from '@/constants/imageUrls';
import {
  useDocumentTitle, useFeaturedProducts, useNewProducts, useRecommendedProducts, useScrollTop
} from '@/hooks';
import useDashboardData from '@/hooks/useDashboardData';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import productService from '@/services/productService';

const HomePage = () => {
  const [activeBannerIndex, setActiveBannerIndex] = useState(0);

  useDocumentTitle('ARUDRA | Home');
  useScrollTop();

  const {
    newProducts,
    fetchNewProducts,
    isLoading: isLoadingNewProducts,
    error: errorNewProducts
  } = useNewProducts(6);
  const {
    featuredProducts,
    fetchFeaturedProducts,
    isLoading: isLoadingFeatured,
    error: errorFeatured
  } = useFeaturedProducts(6);
  const {
    recommendedProducts,
    fetchRecommendedProducts,
    isLoading: isLoadingRecommended,
    error: errorRecommended
  } = useRecommendedProducts(6);

  const {
    dashboardData,
    isLoading: isLoadingDashboard
  } = useDashboardData();
  const bannerImages = dashboardData?.Banner || [];
  const heroImage = bannerImages[activeBannerIndex]?.BannerFile || IMAGES.homeBanner1;
  const categories = dashboardData?.Categories || [];

  useEffect(() => {
    if (bannerImages.length <= 1) return undefined;

    const sliderTimer = setInterval(() => {
      setActiveBannerIndex((prevIndex) => (prevIndex + 1) % bannerImages.length);
    }, 4000);

    return () => clearInterval(sliderTimer);
  }, [bannerImages.length]);
  const categoryProductSections = categories
    .filter((category) => Array.isArray(category.Products) && category.Products.length > 0)
    .slice(0, 3);
  const showCategorySkeleton = isLoadingDashboard || dashboardData === null;

  return (
    <main className="content">
      <div className="home">
        <div className="banner">
          {/* <div className="banner-desc">
            <h1 className="text-thin">
              Buy Our Products Anytime
            </h1>
            <p>
              We provide the best products for you. You can buy our products anytime and anywhere.
            </p>
            <br />
            <Link to={SHOP} className="button">
              Shop Now &nbsp;
              <ArrowRightOutlined />
            </Link>
          </div> */}
          <div className="banner-img">
            <img src={heroImage} alt="Promotional banner" loading="lazy" />
            {bannerImages.length > 1 && (
              <div className="banner-slider-dots" aria-label="Banner slider pagination">
                {bannerImages.map((banner, index) => (
                  <button
                    key={banner.BannerFile || `banner-${index}`}
                    type="button"
                    className={`banner-slider-dot ${index === activeBannerIndex ? 'active' : ''}`}
                    onClick={() => setActiveBannerIndex(index)}
                    aria-label={`Show banner ${index + 1}`}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
        <div className="display">
          <div className="display-header">
            <h1>Categories</h1>
          </div>

          <div className="category-scroll-row">
            {showCategorySkeleton ? (
              <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: '120px',
                width: '100%'
              }}>
                <div className="spinner" style={{
                  width: '32px',
                  height: '32px',
                  border: '4px solid rgba(0,0,0,0.1)',
                  borderTop: '4px solid #c0392b',
                  borderRadius: '50%',
                  animation: 'spin 0.8s linear infinite'
                }} />
              </div>
            ) : (
              categories.slice(0, 8).map((category) => {
                const categoryId = category.CategoryId ?? category.CategoryID ?? category.id ?? category.categoryId;
                const categoryName = category.name || category.CategoryName;
                const categoryLink = categoryId != null
                  ? `/category/${encodeURIComponent(String(categoryId))}/${encodeURIComponent(categoryName)}`
                  : `/category/${encodeURIComponent(categoryName)}`;

                return (
                  <Link
                    key={categoryId ?? categoryName}
                    to={categoryLink}
                    className="category-card"
                  >
                    <div className="category-card-image">
                      {category.CategoryFile ? (
                        <img
                          src={category.CategoryFile}
                          alt={categoryName}
                        />
                      ) : (
                        <div className="category-card-placeholder">
                          {categoryName?.charAt(0)}
                        </div>
                      )}
                    </div>
                    <span className="category-card-label">
                      {categoryName}
                    </span>
                  </Link>
                );
              })
            )}
          </div>

        </div>

        {categoryProductSections.map((category) => {
          const categoryName = category.name || category.CategoryName;
          const categoryProducts = category.Products || [];

          return (
            <div className="display" key={category.CategoryId || categoryName}>
              <div className="display-header">
                <h1>{categoryName}</h1>
                <Link to={`/category/${encodeURIComponent(String(category.CategoryId ?? categoryName))}/${encodeURIComponent(categoryName)}`}>
                  See All
                </Link>
              </div>
              <ProductSlider
                products={categoryProducts.slice(0, 6)}
                skeletonCount={6}
                isLoading={false}
              />
            </div>
          );
        })}

        <div className="display">
          <div className="display-header">
            <h1>New Arrivals</h1>
            <Link to={NEW_PRODUCTS}>See All</Link>
          </div>
          {(errorNewProducts && !isLoadingNewProducts) ? (
            <MessageDisplay
              message={errorNewProducts}
              action={fetchNewProducts}
              buttonLabel="Try Again"
            />
          ) : (
            <ProductSlider
              products={newProducts}
              skeletonCount={6}
              isLoading={isLoadingNewProducts}
            />
          )}
        </div>
        <div className="display">
          <div className="display-header">
            <h1>Featured Products</h1>
            <Link to={FEATURED_PRODUCTS}>See All</Link>
          </div>
          {(errorFeatured && !isLoadingFeatured) ? (
            <MessageDisplay
              message={errorFeatured}
              action={fetchFeaturedProducts}
              buttonLabel="Try Again"
            />
          ) : (
            <ProductSlider
              products={featuredProducts}
              skeletonCount={6}
              isLoading={isLoadingFeatured}
            />
          )}
        </div>
        <div className="display">
          <div className="display-header">
            <h1>Products on Offer</h1>
            <Link to={RECOMMENDED_PRODUCTS}>See All</Link>
          </div>
          {(errorRecommended && !isLoadingRecommended) ? (
            <MessageDisplay
              message={errorRecommended}
              action={fetchRecommendedProducts}
              buttonLabel="Try Again"
            />
          ) : (
            <ProductSlider
              products={recommendedProducts}
              skeletonCount={6}
              isLoading={isLoadingRecommended}
            />
          )}
        </div>
        <div className="blk_section-container">
          <div className="blk_section">
            <h2>Welcome to Our Bulk Order Section</h2>
            <p>Are you looking to purchase our products in bulk? We offer special discounts and dedicated support for bulk orders. Simply fill out the form below, and we'll get back to you with pricing and availability.</p>
            <Link to="/bulk-order" className="button" style={{ "max-width": "300px" }}>
              Bulk Order Request &nbsp;
              <ArrowRightOutlined />
            </Link>
          </div>

        </div>
        <FeaturesSection />
      </div>
    </main>
  );
};

export default HomePage;
