import {
  deleteUnitOfMeasureThunk,
  getAllUnitsOfMeasure,
  upsertUnitOfMeasureThunk,
} from '../thunks';
import axiosInstance from '@/services/setup/api';
import { getDispatch } from '@/modules/shared/test-config/helpers/dispatchHelper';
import { SettingsPagesResponse } from '../../../consts/interfaces';
import {
  expectedSettingsPageResponse,
  mockedSettingsData,
} from '@/modules/shared/test-config/helpers/consts/settings-page-mock';

const errorMessage = 'error message';

test('getAll UnitOfMeasure thunk success', async () => {
  const getSpy = vi
    .spyOn(axiosInstance, 'get')
    .mockResolvedValueOnce({ data: expectedSettingsPageResponse });

  const dispatch = getDispatch();
  const response = await dispatch(getAllUnitsOfMeasure());
  const result: SettingsPagesResponse = response.payload as SettingsPagesResponse;
  expect(result.data).toEqual(mockedSettingsData);
  expect(getSpy).toHaveBeenCalled();
});

test('getAll UnitOfMeasure thunk failed', async () => {
  const getSpy = vi
    .spyOn(axiosInstance, 'get')
    .mockImplementation(() => Promise.reject(new Error(errorMessage)));
  const dispatch = getDispatch();
  const response = await dispatch(getAllUnitsOfMeasure());
  expect(response.payload).toEqual(errorMessage);
  expect(getSpy).toHaveBeenCalled();
});

test('Upsert UnitOfMeasure thunk failed', async () => {
  const postSpy = vi
    .spyOn(axiosInstance, 'post')
    .mockImplementation(() => Promise.reject(new Error(errorMessage)));
  const dispatch = getDispatch();
  const response = await dispatch(upsertUnitOfMeasureThunk({ id: 0, code: 'Code', name: 'Name' }));
  expect(response.payload).toEqual(errorMessage);
  expect(postSpy).toHaveBeenCalled();
});

test('Upsert UnitOfMeasure thunk post success', async () => {
  const postSpy = vi
    .spyOn(axiosInstance, 'post')
    .mockResolvedValueOnce({ data: [{ name: 'Name', code: 'Code', id: 1 }] });
  const dispatch = getDispatch();
  const response = await dispatch(upsertUnitOfMeasureThunk({ id: 0, code: 'Code', name: 'Name' }));
  const result: SettingsPagesResponse = response.payload as SettingsPagesResponse;
  expect(result).toEqual([{ code: 'Code', name: 'Name', id: 1 }]);
  expect(postSpy).toHaveBeenCalled();
});

test('Upsert UnitOfMeasure put success', async () => {
  const postSpy = vi
    .spyOn(axiosInstance, 'put')
    .mockResolvedValueOnce({ data: [{ name: 'Name', code: 'Code', id: 1 }] });
  const dispatch = getDispatch();
  const response = await dispatch(upsertUnitOfMeasureThunk({ code: 'Code', name: 'Name', id: 1 }));
  const result: SettingsPagesResponse = response.payload as SettingsPagesResponse;
  expect(result).toEqual({ code: 'Code', name: 'Name', id: 1 });
  expect(postSpy).toHaveBeenCalled();
});

test('Delete UnitOfMeasure success', async () => {
  const deleteSpy = vi.spyOn(axiosInstance, 'delete').mockResolvedValueOnce(1);
  const dispatch = getDispatch();
  const response = await dispatch(deleteUnitOfMeasureThunk(1));
  expect(response.payload).toEqual(1);
  expect(deleteSpy).toHaveBeenCalled();
});

test('Delete UnitOfMeasure failed', async () => {
  const deleteSpy = vi
    .spyOn(axiosInstance, 'delete')
    .mockImplementation(() => Promise.reject(new Error(errorMessage)));
  const dispatch = getDispatch();
  const response = await dispatch(deleteUnitOfMeasureThunk(1));
  expect(response.payload).toEqual(errorMessage);
  expect(deleteSpy).toHaveBeenCalled();
});
