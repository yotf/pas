import { SETTINGS_PAGE } from '@/modules/main/consts/pageRouter';
import { renderWrapper, RoutingOptions } from '@/modules/shared/test-config/renderWrapper';
import axiosInstance from '@/services/setup/api';
import { screen, waitFor } from '@testing-library/react';
import { Outlet, RouteObject } from 'react-router-dom';
import { mockedData } from '../../settings/redux/user/__test__/consts';
import Users from '../users.page';

const routes: RouteObject[] = [
  {
    path: SETTINGS_PAGE,
    element: <Outlet />,
    children: [
      {
        index: true,
        element: <Users />,
      },
    ],
  },
];

const routerOptions: RoutingOptions = {
  extraRoutes: routes,
  goToUrl: SETTINGS_PAGE,
};

describe('Users page', () => {
  test('get users', async () => {
    const getSpy = vi.spyOn(axiosInstance, 'get').mockResolvedValueOnce({ data: mockedData });
    renderWrapper({}, routerOptions);
    await waitFor(() => screen.getByTestId('users'));
    expect(getSpy).toHaveBeenCalled();
  });
});
