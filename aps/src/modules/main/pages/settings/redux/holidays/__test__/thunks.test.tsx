import {
  expectedSettingsPageResponse,
  mockedSettingsData,
} from '@/modules/shared/test-config/helpers/consts/settings-page-mock';
import { getDispatch } from '@/modules/shared/test-config/helpers/dispatchHelper';
import axiosInstance from '@/services/setup/api';
import { SettingsPagesResponse } from '../../../consts/interfaces';
import { getAllHolidays } from '../thunks';

test('Holidays thunk success', async () => {
  const getSpy = vi
    .spyOn(axiosInstance, 'get')
    .mockResolvedValueOnce({ data: expectedSettingsPageResponse });

  const dispatch = getDispatch();
  const response = await dispatch(getAllHolidays());
  const result: SettingsPagesResponse = response.payload as SettingsPagesResponse;
  expect(result.data).toEqual(mockedSettingsData);
  expect(getSpy).toHaveBeenCalled();
});

test('Holidays thunk failed', async () => {
  const errorMessage = 'error message';

  const getSpy = vi
    .spyOn(axiosInstance, 'get')
    .mockImplementation(() => Promise.reject(new Error(errorMessage)));
  const dispatch = getDispatch();
  const response = await dispatch(getAllHolidays());
  expect(response.payload).toEqual(errorMessage);
  expect(getSpy).toHaveBeenCalled();
});
