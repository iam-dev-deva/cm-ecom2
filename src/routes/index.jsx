import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import AuthLayout from '../layouts/AuthLayout';

// Import pages
// import Home from '../pages/Home/Home';
// import Products from '../pages/Products/Products';
// import ProductDetails from '../pages/ProductDetails/ProductDetails';
// import Cart from '../pages/Cart/Cart';
// import Checkout from '../pages/Checkout/Checkout';
// import Orders from '../pages/Orders/Orders';
// import Login from '../pages/Login/Login';
// import Register from '../pages/Register/Register';

const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      // {
      //   path: '',
      //   element: <Home />,
      // },
      // {
      //   path: 'products',
      //   element: <Products />,
      // },
      // {
      //   path: 'products/:id',
      //   element: <ProductDetails />,
      // },
      // {
      //   path: 'cart',
      //   element: <Cart />,
      // },
      // {
      //   path: 'checkout',
      //   element: <Checkout />,
      // },
      // {
      //   path: 'orders',
      //   element: <Orders />,
      // },
    ],
  },
  {
    path: 'auth',
    element: <AuthLayout />,
    children: [
      // {
      //   path: 'login',
      //   element: <Login />,
      // },
      // {
      //   path: 'register',
      //   element: <Register />,
      // },
    ],
  },
]);

export const AppRouter = () => {
  return <RouterProvider router={router} />;
};

export default AppRouter;
