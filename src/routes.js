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
import Translation from './pages/tools/Translation';
import PdfReader from './pages/tools/PdfReader';
import IconButton from './theme/overrides/IconButton';

// ----------------------------------------------------------------------

export default function Router() {
  return useRoutes([
    {
      path: '/dashboard',
      element: <DashboardLayout />,
      children: [
        // { path: '/s', element: <Navigate to="/dashboard/app" replace /> },
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
        // {
        //   path: '/',
        //   element: <Login />
        // },
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
        { path: 'index/blog/list', element: <User /> },
        { path: 'index/blog/add', element: <BlogAdd /> },
        { path: 'index/blog/edit', element: <BlogEdit /> },
        { path: 'index/blog/view', element: <BlogView /> },
        /* { path: '/tools/translation', element: <Translation /> }, */
        { path: 'index/reader', element: <PdfReader /> }
      ]
    },

    {
      path: '/',
      element: <Navigate to="/index" />
    },

    { path: '*', element: <Navigate to="/404" replace /> }
  ]);
}
