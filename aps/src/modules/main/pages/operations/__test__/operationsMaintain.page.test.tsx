import { OPERATIONS_PAGE } from '@/modules/main/consts/pageRouter';
import { renderWrapper, RoutingOptions } from '@/modules/shared/test-config/renderWrapper';
import { screen } from '@testing-library/react';
import { Outlet, RouteObject } from 'react-router-dom';
import { test } from 'vitest';
import OperationsMaintain from '../operationsMaintain.page';
import { mockedOperation } from './consts';

const routes: RouteObject[] = [
  {
    path: OPERATIONS_PAGE,
    element: <Outlet />,
    children: [
      {
        index: true,
        element: <OperationsMaintain />,
      },
    ],
  },
];

const routerOptions: RoutingOptions = {
  extraRoutes: routes,
  goToUrl: OPERATIONS_PAGE,
};

test('operations maintain page should render properly', () => {
  renderWrapper({ preloadedState: { operation: mockedOperation as any } }, routerOptions);

  const page = screen.getByTestId('operations-maintain');
  expect(page).toBeInTheDocument();
});
