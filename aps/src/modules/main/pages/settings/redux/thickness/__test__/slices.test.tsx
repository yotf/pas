import { mockedSettingsData } from '@/modules/shared/test-config/helpers/consts/settings-page-mock';
import { SettingsPagesResponse } from '../../../consts/interfaces';
import { filterThickness, thicknessReducer } from '../slice';
import { initialSettingsState } from '../states';
import { getAllThickness } from '../thunks';

test('Thickness - should return the initial state', () => {
  expect(thicknessReducer(undefined, { type: undefined })).toEqual({
    loading: true,
    error: undefined,
    data: [],
    filtered: [],
  });
});

test('Thickness - should filter an array', async () => {
  const previousState: SettingsPagesResponse = {
    data: mockedSettingsData,
    filtered: mockedSettingsData,
  };

  const parameters = await thicknessReducer(previousState, filterThickness('1'));

  expect(parameters).toEqual({
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

test('Fetch thickness fulfilled', async () => {
  const action = { type: getAllThickness.fulfilled.type, payload: mockedSettingsData };
  const state = thicknessReducer(initialSettingsState, action);
  expect(state.loading).not.toBeTruthy();
  expect(state.error).toBe(undefined);
  expect(state.data).toEqual(mockedSettingsData);
  expect(state.filtered).toEqual(state.data);
});

test('Fetch thickness rejected', async () => {
  const expectedWithError = {
    message: 'error message',
  };
  const action = { type: getAllThickness.rejected.type, error: expectedWithError };
  const state = thicknessReducer(initialSettingsState, action);
  expect(state.loading).not.toBeTruthy();
  expect(state.error).toEqual(expectedWithError.message);
  expect(state.data).toEqual([]);
  expect(state.filtered).toEqual(state.data);
});
