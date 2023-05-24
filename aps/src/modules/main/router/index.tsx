/**
 * @module AppRouter
 */

import { NOT_FOUND_PATH } from '@/modules/shared/consts/pageRoutes.const';
import NotFoundPage from '@/modules/shared/pages/notFound/notFound.page';
import { RouteObject } from 'react-router-dom';
import { MAIN_LAYOUT } from '../consts/pageRouter';
import MainLayout from '../layout/main.layout';
import HomePage from '../pages/home/home.page';
import routes from './routes';

export const mainRouter: RouteObject = {
  path: MAIN_LAYOUT,
  element: <MainLayout />,
  children: [
    {
      index: true,
      element: <HomePage />,
    },
    ...routes,
    {
      path: NOT_FOUND_PATH,
      element: <NotFoundPage />,
    },
    {
      path: '*',
      element: <NotFoundPage />,
    },
  ],
};
