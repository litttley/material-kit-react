import { Navigate, useRoutes } from 'react-router-dom';
import React from 'react';
import DashboardLayout from './layouts/dashboard';
import LogoOnlyLayout from './layouts/LogoOnlyLayout';
import MyBlogLayout from './layouts/MyBlogLayout';
//
import Login from './pages/Login';
// import Index from './pages/Index';
import Register from './pages/Register';
import DashboardApp from './pages/DashboardApp';
import Products from './pages/Products';
import Blog from './pages/Blog';
import MyBlog from './pages/MyBlog';
import User from './pages/User';
import NotFound from './pages/Page404';

import BlogAdd from './pages/BlogAdd';
import BlogEdit from './pages/BlogEdit';
import BlogView from './pages/BlogView';
import Translation from './pages/tools/Translation';
import PdfReader from './pages/tools/PdfReader';
import Stock from './pages/Stock';
import StockWatch from './pages/StockWatch';

import IconButton from './theme/overrides/IconButton';

// ----------------------------------------------------------------------

export default function Router() {
  return useRoutes([
    {
      path: '/dashboard',
      element: <DashboardLayout />,
      children: [
        // { path: '/s', element: <Navigate to="/dashboard/app" replace /> },

        { element: <Navigate to="/dashboard/app" replace /> },
        { path: 'app', element: <DashboardApp /> },
        { path: 'user', element: <User /> },
        { path: 'products', element: <Products /> },
        { path: 'blog', element: <Blog /> },
        { path: 'myblog', element: <MyBlog /> }
      ]
    },
    {
      path: '/login',
      element: <LogoOnlyLayout />,
      children: [
        {
          path: '',
          element: <Login />
        },
        { path: 'register', element: <Register /> },
        { path: '404', element: <NotFound /> },
        // { path: '/s', element: <Navigate to="/dashboard" /> },
        { path: '*', element: <Navigate to="/404" /> }
      ]
    },

    {
      path: '/index',
      element: <MyBlogLayout />,
      children: [
        { path: 'blog/list', element: <User /> },
        { path: 'blog/add', element: <BlogAdd /> },
        { path: 'blog/edit', element: <BlogEdit /> },
        { path: 'blog/view', element: <BlogView /> },
        //  { path: '/tools/translation', element: <Translation /> },
        { path: 'reader', element: <PdfReader /> },
        { path: 'stock', element: <Stock /> },
        { path: 'stockWatch', element: <StockWatch /> }
      ]
    },

    {
      path: '/',
      element: <Navigate to="/index" />
    },

    { path: '*', element: <Navigate to="/404" replace /> }
  ]);
}
