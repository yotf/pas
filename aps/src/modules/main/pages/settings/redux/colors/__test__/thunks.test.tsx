import { mockedSettingsData } from '@/modules/shared/test-config/helpers/consts/settings-page-mock';
import { getDispatch } from '@/modules/shared/test-config/helpers/dispatchHelper';
import axiosInstance from '@/services/setup/api';
import { SettingsPagesResponse } from '../../../consts/interfaces';
import { errorMessage } from '../../user/__test__/consts';
import { deleteColorsThunk, getAllColors, upsertColorsThunk } from '../thunks';

const expected: SettingsPagesResponse = {
  data: mockedSettingsData,
  loading: false,
  error: undefined,
  filtered: mockedSettingsData,
};

test('getAll colors thunk success', async () => {
  const getSpy = vi.spyOn(axiosInstance, 'get').mockResolvedValueOnce({ data: expected });

  const dispatch = getDispatch();
  const response = await dispatch(getAllColors());
  const result: SettingsPagesResponse = response.payload as SettingsPagesResponse;
  expect(result.data).toEqual(expected.data);
  expect(getSpy).toHaveBeenCalled();
});

test('getAll colors thunk failed', async () => {
  const getSpy = vi
    .spyOn(axiosInstance, 'get')
    .mockImplementation(() => Promise.reject(new Error(errorMessage)));
  const dispatch = getDispatch();
  const response = await dispatch(getAllColors());
  expect(response.payload).toEqual(errorMessage);
  expect(getSpy).toHaveBeenCalled();
});

test('Upsert Colors thunk failed', async () => {
  const postSpy = vi
    .spyOn(axiosInstance, 'post')
    .mockImplementation(() => Promise.reject(new Error(errorMessage)));
  const dispatch = getDispatch();
  const response = await dispatch(upsertColorsThunk({ id: 0, code: 'Code', name: 'Name' }));
  expect(response.payload).toEqual(errorMessage);
  expect(postSpy).toHaveBeenCalled();
});

test('Upsert Colors thunk post success', async () => {
  const postSpy = vi
    .spyOn(axiosInstance, 'post')
    .mockResolvedValueOnce({ data: [{ name: 'Name', code: 'Code', id: 1 }] });
  const dispatch = getDispatch();
  const response = await dispatch(upsertColorsThunk({ id: 0, code: 'Code', name: 'Name' }));
  const result: SettingsPagesResponse = response.payload as SettingsPagesResponse;
  expect(result).toEqual([{ code: 'Code', name: 'Name', id: 1 }]);
  expect(postSpy).toHaveBeenCalled();
});

test('Upsert Colors put success', async () => {
  const postSpy = vi
    .spyOn(axiosInstance, 'put')
    .mockResolvedValueOnce({ data: [{ name: 'Name', code: 'Code', id: 1 }] });
  const dispatch = getDispatch();
  const response = await dispatch(upsertColorsThunk({ code: 'Code', name: 'Name', id: 1 }));
  const result: SettingsPagesResponse = response.payload as SettingsPagesResponse;
  expect(result).toEqual({ code: 'Code', name: 'Name', id: 1 });
  expect(postSpy).toHaveBeenCalled();
});

test('Delete Colors success', async () => {
  const deleteSpy = vi.spyOn(axiosInstance, 'delete').mockResolvedValueOnce('1');
  const dispatch = getDispatch();
  const response = await dispatch(deleteColorsThunk(1));
  expect(response.payload).toEqual(1);
  expect(deleteSpy).toHaveBeenCalled();
});

test('Delete Colors failed', async () => {
  const deleteSpy = vi
    .spyOn(axiosInstance, 'delete')
    .mockImplementation(() => Promise.reject(new Error(errorMessage)));
  const dispatch = getDispatch();
  const response = await dispatch(deleteColorsThunk(1));
  expect(response.payload).toEqual(errorMessage);
  expect(deleteSpy).toHaveBeenCalled();
});
