import {
  mockedSettingsData,
  routerSettingsOptions,
} from '@/modules/shared/test-config/helpers/consts/settings-page-mock';
import { renderWrapper } from '@/modules/shared/test-config/renderWrapper';
import axiosInstance from '@/services/setup/api';
import { screen, waitFor } from '@testing-library/react';
import UnitOfMeasure from '../unitOfMeasure.page';

test('unit of measure page gets data and renders properly', async () => {
  const getSpy = vi.spyOn(axiosInstance, 'get').mockResolvedValueOnce({ data: mockedSettingsData });
  renderWrapper({}, routerSettingsOptions(<UnitOfMeasure />));
  await waitFor(() => screen.getByTestId('settings_table'));
  expect(getSpy).toHaveBeenCalled();
});
