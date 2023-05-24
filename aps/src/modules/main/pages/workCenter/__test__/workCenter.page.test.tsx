import { WORK_CENTER_PAGE } from '@/modules/main/consts/pageRouter';
import { renderWrapper, RoutingOptions } from '@/modules/shared/test-config/renderWrapper';
import axiosInstance from '@/services/setup/api';
import { waitFor, screen } from '@testing-library/react';
import { Outlet, RouteObject } from 'react-router-dom';
import { test } from 'vitest';
import { WorkCentersResponse } from '../../settings/redux/workCenters/interfaces';
import WorkCenterTable from '../workcenter.page';
import { mockedWorkCentersData } from './consts';

const routes: RouteObject[] = [
  {
    path: WORK_CENTER_PAGE,
    element: <Outlet />,
    children: [
      {
        index: true,
        element: <WorkCenterTable />,
      },
    ],
  },
];

const expected: WorkCentersResponse = {
  data: mockedWorkCentersData,
  loading: false,
  error: undefined,
  filtered: mockedWorkCentersData,
};

const routerOptions: RoutingOptions = {
  extraRoutes: routes,
  goToUrl: WORK_CENTER_PAGE,
};

test('work center page gets data and renders properly', async () => {
  const getSpy = vi.spyOn(axiosInstance, 'get').mockResolvedValueOnce({ data: expected });
  renderWrapper({}, routerOptions);
  await waitFor(() => screen.getByTestId('table'));
  expect(getSpy).toHaveBeenCalled();
});
