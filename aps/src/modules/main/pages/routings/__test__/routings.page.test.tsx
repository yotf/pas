import { ROUTING_PAGE } from '@/modules/main/consts/pageRouter';
import { renderWrapper, RoutingOptions } from '@/modules/shared/test-config/renderWrapper';
import axiosInstance from '@/services/setup/api';
import { screen, waitFor } from '@testing-library/react';
import { Outlet, RouteObject } from 'react-router-dom';
import RoutingsTable from '../routings.page';
import { mockedRoutingsData } from './consts';

const routes: RouteObject[] = [
  {
    path: ROUTING_PAGE,
    element: <Outlet />,
    children: [
      {
        index: true,
        element: <RoutingsTable />,
      },
    ],
  },
];

const routerOptions: RoutingOptions = {
  extraRoutes: routes,
  goToUrl: ROUTING_PAGE,
};

describe('Routings page', () => {
  test('get routings', async () => {
    const getSpy = vi
      .spyOn(axiosInstance, 'get')
      .mockResolvedValueOnce({ data: mockedRoutingsData });
    renderWrapper({}, routerOptions);
    await waitFor(() => screen.getByTestId('table'));
    expect(getSpy).toHaveBeenCalled();
  });
});
