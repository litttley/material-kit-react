import { Navigate, useRoutes } from 'react-router-dom';
// layouts
import { TablePagination } from '@material-ui/core';
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
import IconButton from './theme/overrides/IconButton';

// ----------------------------------------------------------------------

export default function Router() {
  return useRoutes([
    {
      path: '/dashboard',
      element: <DashboardLayout />,
      children: [
        { path: '/s', element: <Navigate to="/dashboard/app" replace /> },
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
          path: '/',
          element: <Login />
        },
        { path: 'register', element: <Register /> },
        { path: '404', element: <NotFound /> },
        { path: '/s', element: <Navigate to="/dashboard" /> },
        { path: '*', element: <Navigate to="/404" /> }
      ]
    },

    {
      path: '/blog',
      element: <MyBlogLayout />,
      children: [
        { path: 'list', element: <User /> },
        { path: 'add', element: <BlogAdd /> },
        { path: 'edit', element: <BlogEdit /> },
        { path: 'view', element: <BlogView /> }
      ]
    },

    {
      path: '/',
      element: <Navigate to="/blog" />
    },

    { path: '*', element: <Navigate to="/404" replace /> }
  ]);
}
