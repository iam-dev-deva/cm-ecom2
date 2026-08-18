import Basket from '@/components/basket/Basket';
import Footer from '@/components/common/Footer';
import Navigation from '@/components/common/Navigation';
import * as ROUTES from '@/constants/routes';
import { createBrowserHistory } from 'history';
import React from 'react';
import { Route, Router, Switch } from 'react-router-dom';
import AddProduct from '@/views/admin/add_product/AddProductPage';
import AdminDashboardPage from '@/views/admin/dashboard/AdminDashboardPage';
import EditProductPage from '@/views/admin/edit_product/EditProductPage';
import ProductsPage from '@/views/admin/products/ProductsPage';
import ForgotPasswordPage from '@/views/auth/forgot_password/ForgotPasswordPage';
import SignInPage from '@/views/auth/signin/SignInPage';
import SignUpPage from '@/views/auth/signup/SignUpPage';
import CheckoutStep1Page from '@/views/checkout/step1/CheckoutStep1Page';
import CheckoutStep2Page from '@/views/checkout/step2/CheckoutStep2Page';
import CheckoutStep3Page from '@/views/checkout/step3/CheckoutStep3Page';
import FeaturedProductsPage from '@/views/featured/FeaturedProductsPage';
import HomePage from '@/views/home/HomePage';
import CategoryProductsPage from '@/views/category/CategoryProductsPage';
import PageNotFound from '@/views/error/PageNotFound';
import RecommendedProductsPage from '@/views/recommended/RecommendedProductsPage';
import SearchPage from '@/views/search/SearchPage';
import ShopPage from '@/views/shop/ShopPage';
import UserAccountPage from '@/views/account/user_account/UserAccountPage';
import EditAccountPage from '@/views/account/edit_account/EditAccountPage';
import ViewProductPage from '@/views/view_product/ViewProductPage';
import AdminRoute from './AdminRoute';
import ClientRoute from './ClientRoute';
import PublicRoute from './PublicRoute';

// Revert back to history v4.10.0 because
// v5.0 breaks navigation
export const history = createBrowserHistory();

const AppRouter = () => (
  <Router history={history}>
    <>
      <Navigation />
      <Basket />
      <Switch>
        <Route
          component={SearchPage}
          exact
          path={ROUTES.SEARCH}
        />
        <Route
          component={HomePage}
          exact
          path={ROUTES.HOME}
        />
        <Route
          component={ShopPage}
          exact
          path={ROUTES.SHOP}
        />
        <Route
          component={FeaturedProductsPage}
          exact
          path={ROUTES.FEATURED_PRODUCTS}
        />
        <Route
          component={RecommendedProductsPage}
          exact
          path={ROUTES.RECOMMENDED_PRODUCTS}
        />
        <Route
          component={CategoryProductsPage}
          path={ROUTES.CATEGORY_PRODUCTS}
        />
        <Route
          component={CategoryProductsPage}
          path={ROUTES.LEGACY_CATEGORY_PRODUCTS}
        />
        <PublicRoute
          component={SignUpPage}
          path={ROUTES.SIGNUP}
        />
        <PublicRoute
          component={SignInPage}
          exact
          path={ROUTES.SIGNIN}
        />
        <PublicRoute
          component={ForgotPasswordPage}
          path={ROUTES.FORGOT_PASSWORD}
        />
        <Route
          component={ViewProductPage}
          path={ROUTES.VIEW_PRODUCT}
        />
        <ClientRoute
          component={UserAccountPage}
          exact
          path={ROUTES.ACCOUNT}
        />
        <ClientRoute
          component={EditAccountPage}
          exact
          path={ROUTES.ACCOUNT_EDIT}
        />
        <ClientRoute
          component={CheckoutStep1Page}
          path={ROUTES.CHECKOUT_STEP_1}
        />
        <ClientRoute
          component={CheckoutStep2Page}
          path={ROUTES.CHECKOUT_STEP_2}
        />
        <ClientRoute
          component={CheckoutStep3Page}
          path={ROUTES.CHECKOUT_STEP_3}
        />
        <AdminRoute
          component={AdminDashboardPage}
          exact
          path={ROUTES.ADMIN_DASHBOARD}
        />
        <AdminRoute
          component={ProductsPage}
          path={ROUTES.ADMIN_PRODUCTS}
        />
        <AdminRoute
          component={AddProduct}
          path={ROUTES.ADD_PRODUCT}
        />
        <AdminRoute
          component={EditProductPage}
          path={`${ROUTES.EDIT_PRODUCT}/:id`}
        />
        <PublicRoute component={PageNotFound} />
      </Switch>
      <Footer />
    </>
  </Router>
);

export default AppRouter;
