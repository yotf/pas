import {
  expectedSettingsPageResponse,
  routerSettingsOptions,
} from '@/modules/shared/test-config/helpers/consts/settings-page-mock';
import { renderWrapper } from '@/modules/shared/test-config/renderWrapper';
import axiosInstance from '@/services/setup/api';
import { screen, waitFor } from '@testing-library/react';
import Departments from '../departments.page';

test('departments page gets data and renders properly', async () => {
  const getSpy = vi
    .spyOn(axiosInstance, 'get')
    .mockResolvedValueOnce({ data: expectedSettingsPageResponse });
  renderWrapper({}, routerSettingsOptions(<Departments />));
  await waitFor(() => screen.getByTestId('settings_table'));
  expect(getSpy).toHaveBeenCalled();
});
