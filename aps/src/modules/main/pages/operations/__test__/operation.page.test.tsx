import { OPERATIONS_PAGE } from '@/modules/main/consts/pageRouter';
import { renderWrapper, RoutingOptions } from '@/modules/shared/test-config/renderWrapper';
import { Outlet, RouteObject } from 'react-router-dom';
import OperationsTable from '../operations.page';
import axiosInstance from '@/services/setup/api';
import { mockedOperationsData } from './consts';
import { waitFor, screen } from '@testing-library/react';

const routes: RouteObject[] = [
  {
    path: OPERATIONS_PAGE,
    element: <Outlet />,
    children: [
      {
        index: true,
        element: <OperationsTable />,
      },
    ],
  },
];

const routerOptions: RoutingOptions = {
  extraRoutes: routes,
  goToUrl: OPERATIONS_PAGE,
};

describe('Operations page', () => {
  test('get operations', async () => {
    const getSpy = vi
      .spyOn(axiosInstance, 'get')
      .mockResolvedValueOnce({ data: mockedOperationsData });
    renderWrapper({}, routerOptions);
    await waitFor(() => screen.getByTestId('table'));
    expect(getSpy).toHaveBeenCalled();
  });
});
