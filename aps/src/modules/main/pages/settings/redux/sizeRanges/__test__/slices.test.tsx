import { mockedSettingsData } from '@/modules/shared/test-config/helpers/consts/settings-page-mock';
import { SettingsPagesResponse } from '../../../consts/interfaces';
import { filterSizeRanges, sizeRangesReducer } from '../slice';
import { initialSettingsState } from '../states';
import { getAllSizeRanges } from '../thunks';

test('Size ranges - should return the initial state', () => {
  expect(sizeRangesReducer(undefined, { type: undefined })).toEqual({
    loading: true,
    error: undefined,
    data: [],
    filtered: [],
  });
});

test('Size ranges - should filter an array', async () => {
  const previousState: SettingsPagesResponse = {
    data: mockedSettingsData,
    filtered: mockedSettingsData,
  };

  const parameters = await sizeRangesReducer(previousState, filterSizeRanges('1'));

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

test('Fetch size ranges fulfilled', async () => {
  const action = { type: getAllSizeRanges.fulfilled.type, payload: mockedSettingsData };
  const state = sizeRangesReducer(initialSettingsState, action);
  expect(state.loading).not.toBeTruthy();
  expect(state.error).toBe(undefined);
  expect(state.data).toEqual(mockedSettingsData);
  expect(state.filtered).toEqual(state.data);
});

test('Fetch size ranges rejected', async () => {
  const expectedWithError = {
    message: 'error message',
  };
  const action = { type: getAllSizeRanges.rejected.type, error: expectedWithError };
  const state = sizeRangesReducer(initialSettingsState, action);
  expect(state.loading).not.toBeTruthy();
  expect(state.error).toEqual(expectedWithError.message);
  expect(state.data).toEqual([]);
  expect(state.filtered).toEqual(state.data);
});
