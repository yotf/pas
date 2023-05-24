import { mockedSettingsData } from '@/modules/shared/test-config/helpers/consts/settings-page-mock';
import { SettingsPagesResponse } from '../../../consts/interfaces';
import { colorsReducer, filterColors } from '../slice';
import { initialSettingsState } from '../states';
import { getAllColors, upsertColorsThunk } from '../thunks';

test('Colors - should return the initial state', () => {
  expect(colorsReducer(undefined, { type: undefined })).toEqual({
    loading: true,
    error: undefined,
    data: [],
    filtered: [],
  });
});

test('Colors - should filter an array', async () => {
  const previousState: SettingsPagesResponse = {
    data: mockedSettingsData,
    filtered: mockedSettingsData,
  };

  const departments = await colorsReducer(previousState, filterColors('1'));

  expect(departments).toEqual({
    filtered: [
      {
        code: 'test 1',
        name: 'test 1',
        id: 1,
      },
    ],
    data: mockedSettingsData,
  });
});

test('getAll colors fulfilled', async () => {
  const action = { type: getAllColors.fulfilled.type, payload: mockedSettingsData };
  const state = colorsReducer(initialSettingsState, action);
  expect(state.loading).not.toBeTruthy();
  expect(state.error).toBe(undefined);
  expect(state.data).toEqual(mockedSettingsData);
  expect(state.filtered).toEqual(state.data);
});

test('getAll colors rejected', async () => {
  const expectedWithError = {
    message: 'error message',
  };
  const action = { type: getAllColors.rejected.type, error: expectedWithError };
  const state = colorsReducer(initialSettingsState, action);
  expect(state.loading).not.toBeTruthy();
  expect(state.error).toEqual(expectedWithError.message);
  expect(state.data).toEqual([]);
  expect(state.filtered).toEqual(state.data);
});

test('upsertColorsThunk fulfilled', async () => {
  const action = { type: upsertColorsThunk.fulfilled.type, payload: mockedSettingsData };
  const state = colorsReducer(initialSettingsState, action);
  expect(state.loading).not.toBeTruthy();
  expect(state.error).toBe(undefined);
});
