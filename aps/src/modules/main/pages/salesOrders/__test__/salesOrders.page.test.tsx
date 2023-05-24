import { SALES_ORDER_PAGE } from '@/modules/main/consts/pageRouter';
import { renderWrapper, RoutingOptions } from '@/modules/shared/test-config/renderWrapper';
import axiosInstance from '@/services/setup/api';
import { screen, waitFor } from '@testing-library/react';
import { Outlet, RouteObject } from 'react-router-dom';
import SalesOrdersTable from '../salesOrders.page';
import { mockedSalesOrdersData } from './conts';

const routes: RouteObject[] = [
  {
    path: SALES_ORDER_PAGE,
    element: <Outlet />,
    children: [
      {
        index: true,
        element: <SalesOrdersTable />,
      },
    ],
  },
];

const routerOptions: RoutingOptions = {
  extraRoutes: routes,
  goToUrl: SALES_ORDER_PAGE,
};

describe('Sales order page', () => {
  test('get sales orders', async () => {
    const getSpy = vi
      .spyOn(axiosInstance, 'get')
      .mockResolvedValueOnce({ data: mockedSalesOrdersData });
    renderWrapper({}, routerOptions);
    await waitFor(() => screen.getByTestId('table'));
    expect(getSpy).toHaveBeenCalled();
  });
});
