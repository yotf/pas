import { mockedSettingsData } from '@/modules/shared/test-config/helpers/consts/settings-page-mock';
import { getDispatch } from '@/modules/shared/test-config/helpers/dispatchHelper';
import axiosInstance from '@/services/setup/api';
import { SettingsPagesResponse } from '../../../consts/interfaces';
import { getAllPositions } from '../thunks';

const expected: SettingsPagesResponse = {
  data: mockedSettingsData,
  loading: false,
  error: undefined,
  filtered: mockedSettingsData,
};

test('Positions thunk success', async () => {
  const getSpy = vi.spyOn(axiosInstance, 'get').mockResolvedValueOnce({ data: expected });

  const dispatch = getDispatch();
  const response = await dispatch(getAllPositions());
  const result: SettingsPagesResponse = response.payload as SettingsPagesResponse;
  expect(result.data).toEqual(expected.data);
  expect(getSpy).toHaveBeenCalled();
});

test('Positions thunk failed', async () => {
  const errorMessage = 'error message';

  const getSpy = vi
    .spyOn(axiosInstance, 'get')
    .mockImplementation(() => Promise.reject(new Error(errorMessage)));
  const dispatch = getDispatch();
  const response = await dispatch(getAllPositions());
  expect(response.payload).toEqual(errorMessage);
  expect(getSpy).toHaveBeenCalled();
});
