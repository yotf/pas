import { MAIN_LAYOUT } from '@/modules/main/consts/pageRouter';
import { fireEvent, screen } from '@testing-library/react';
import * as router from 'react-router-dom';
import { renderWrapper, RoutingOptions } from '../../test-config/renderWrapper';
import NotFoundPage from '../notFound/notFound.page';

const mainTestId = 'main';
const routers: router.RouteObject = {
  path: MAIN_LAYOUT,
  element: <router.Outlet />,
  children: [
    {
      index: true,
      element: <div data-testid={mainTestId}>Test</div>,
    },
    {
      path: '*',
      element: <NotFoundPage />,
    },
  ],
};

test('Not found page - user with token will be redirected to auth layout', () => {
  const stateSetup = {
    preloadedState: {
      auth: {
        token: 'fake-token',
      },
    },
  };
  const routerOptions: RoutingOptions = {
    extraRoutes: [routers],
    goToUrl: '/fake_page',
  };

  renderWrapper(stateSetup, routerOptions);
  const button = screen.getByRole('button');
  fireEvent.click(button);
  expect(screen.getByTestId(mainTestId)).toBeInTheDocument();
});

test('Not found page - user without token will be redirected to login layout', () => {
  const stateSetup = {
    preloadedState: {
      auth: {
        token: null,
      },
    },
  };
  const routerOptions: RoutingOptions = {
    extraRoutes: [routers],
    goToUrl: '/fake_page',
  };

  renderWrapper(stateSetup, routerOptions);
  const button = screen.getByRole('button');
  fireEvent.click(button);
  expect(screen.getByTestId('login')).toBeInTheDocument();
});
