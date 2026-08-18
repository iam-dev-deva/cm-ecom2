import { ArrowRightOutlined } from '@ant-design/icons';
import { MessageDisplay } from '@/components/common';
import { ProductShowcaseGrid } from '@/components/product';
import { FEATURED_PRODUCTS, RECOMMENDED_PRODUCTS, SHOP ,NEW_PRODUCTS} from '@/constants/routes';
import { IMAGES } from '@/constants/imageUrls';
import {
  useDocumentTitle, useFeaturedProducts,useNewProducts, useRecommendedProducts, useScrollTop
} from '@/hooks';
import useDashboardData from '@/hooks/useDashboardData';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import productService from '@/services/productService';

const HomePage = () => {
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
    dashboardData
  } = useDashboardData();
  const bannerImages = dashboardData?.Banner || [];
  const heroImage = bannerImages[0]?.BannerFile || IMAGES.homeBanner1;
  const categories = dashboardData?.Categories || [];

  return (
    <main className="content">
      <div className="home">
        <div className="banner">
          <div className="banner-desc">
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
          </div>
          <div className="banner-img"><img src={heroImage} alt="" loading="lazy" /></div>
        </div>
        <div className="display">
          <div className="display-header">
            <h1>Categories</h1>
          </div>

          <div className="category-scroll-row">
            {categories.slice(0, 8).map((category) => (
              <Link
                key={category.CategoryId || category.CategoryName}
                to={`/category/${encodeURIComponent(category.name || category.CategoryName)}`}
                className="category-card"
              >
                <div className="category-card-image">
                  {category.CategoryFile ? (
                    <img
                      src={category.CategoryFile}
                      alt={category.name || category.CategoryName}
                    />
                  ) : (
                    <div className="category-card-placeholder">
                      {(category.name || category.CategoryName)?.charAt(0)}
                    </div>
                  )}
                </div>
                <span className="category-card-label">
                  {category.name || category.CategoryName}
                </span>
              </Link>
            ))}
          </div>

        </div>
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
            <ProductShowcaseGrid
              products={newProducts}
              skeletonCount={6}
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
            <ProductShowcaseGrid
              products={featuredProducts}
              skeletonCount={6}
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
            <ProductShowcaseGrid
              products={recommendedProducts}
              skeletonCount={6}
            />
          )}
        </div>
      </div>
    </main>
  );
};

export default HomePage;
