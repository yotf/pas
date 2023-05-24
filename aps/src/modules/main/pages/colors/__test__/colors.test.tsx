import { SETTINGS_PAGE } from '@/modules/main/consts/pageRouter';
import { mockedSettingsData } from '@/modules/shared/test-config/helpers/consts/settings-page-mock';
import { renderWrapper, RoutingOptions } from '@/modules/shared/test-config/renderWrapper';
import axiosInstance from '@/services/setup/api';
import { screen, waitFor } from '@testing-library/react';
import { Outlet, RouteObject } from 'react-router-dom';
import { SettingsPagesResponse } from '../../settings/consts/interfaces';
import Colors from '../colors.page';
const routes: RouteObject[] = [
  {
    path: SETTINGS_PAGE,
    element: <Outlet />,
    children: [
      {
        index: true,
        element: <Colors />,
      },
    ],
  },
];

const expected: SettingsPagesResponse = {
  data: mockedSettingsData,
  loading: false,
  error: undefined,
  filtered: mockedSettingsData,
};

const routerOptions: RoutingOptions = {
  extraRoutes: routes,
  goToUrl: SETTINGS_PAGE,
};

test('colors page gets data and renders properly', async () => {
  const getSpy = vi.spyOn(axiosInstance, 'get').mockResolvedValueOnce({ data: expected });
  renderWrapper({}, routerOptions);
  await waitFor(() => screen.getByTestId('settings_table'));
  expect(getSpy).toHaveBeenCalled();
});
