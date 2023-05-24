import { MATERIAL_PAGE } from '@/modules/main/consts/pageRouter';
import { renderWrapper, RoutingOptions } from '@/modules/shared/test-config/renderWrapper';
import axiosInstance from '@/services/setup/api';
import { screen, waitFor } from '@testing-library/react';
import { Outlet, RouteObject } from 'react-router-dom';
import MaterialsTable from '../materials.page';
import { mockedMaterialsData } from './consts';

const routes: RouteObject[] = [
  {
    path: MATERIAL_PAGE,
    element: <Outlet />,
    children: [
      {
        index: true,
        element: <MaterialsTable />,
      },
    ],
  },
];

const routerOptions: RoutingOptions = {
  extraRoutes: routes,
  goToUrl: MATERIAL_PAGE,
};

describe('Materials page', () => {
  test('get materials', async () => {
    const getSpy = vi
      .spyOn(axiosInstance, 'get')
      .mockResolvedValueOnce({ data: mockedMaterialsData });
    renderWrapper({}, routerOptions);
    await waitFor(() => screen.getByTestId('table'));
    expect(getSpy).toHaveBeenCalled();
  });
});
