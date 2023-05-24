import { PRODUCTION_CALENDAR_PAGE } from '@/modules/main/consts/pageRouter';
import { renderWrapper, RoutingOptions } from '@/modules/shared/test-config/renderWrapper';
import axiosInstance from '@/services/setup/api';
import { screen, waitFor } from '@testing-library/react';
import { Outlet, RouteObject } from 'react-router-dom';
import ProductionCalendarTable from '../productionCalendars.page';
import { mockedProductionCalendarsData } from './consts';

const routes: RouteObject[] = [
  {
    path: PRODUCTION_CALENDAR_PAGE,
    element: <Outlet />,
    children: [
      {
        index: true,
        element: <ProductionCalendarTable />,
      },
    ],
  },
];

const routerOptions: RoutingOptions = {
  extraRoutes: routes,
  goToUrl: PRODUCTION_CALENDAR_PAGE,
};

describe('Production Calendars page', () => {
  test('get Production Calendars', async () => {
    const getSpy = vi
      .spyOn(axiosInstance, 'get')
      .mockResolvedValueOnce({ data: mockedProductionCalendarsData });
    renderWrapper({}, routerOptions);
    await waitFor(() => screen.getByTestId('table'));
    expect(getSpy).toHaveBeenCalled();
  });
});
