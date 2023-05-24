/**
 * @module AuthRouter
 */

import { RouteObject } from 'react-router-dom';
import AuthLayout from '../layout/auth.layout';
import { AUTH_LAYOUT, LOGIN_PAGE } from '../consts/pageRoutes';
import LoginPage from '../pages/login/login.page';

/**
 * Creates auth router
 */
export const authRouter: RouteObject = {
  path: AUTH_LAYOUT,
  element: <AuthLayout />,
  children: [
    {
      index: true,
      path: LOGIN_PAGE,
      element: <LoginPage />,
    },
  ],
};
