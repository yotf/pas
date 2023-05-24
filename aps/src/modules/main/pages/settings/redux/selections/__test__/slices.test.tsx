import { mockedSettingsData } from '@/modules/shared/test-config/helpers/consts/settings-page-mock';
import { SettingsPagesResponse } from '../../../consts/interfaces';
import { filterSelections, selectionsReducer } from '../slice';
import { initialSettingsState } from '../states';
import { getAllSelections } from '../thunks';

test('Selections - should return the initial state', () => {
  expect(selectionsReducer(undefined, { type: undefined })).toEqual({
    loading: true,
    error: undefined,
    data: [],
    filtered: [],
  });
});

test('Selections - should filter an array', async () => {
  const previousState: SettingsPagesResponse = {
    data: mockedSettingsData,
    filtered: mockedSettingsData,
  };

  const parameters = await selectionsReducer(previousState, filterSelections('1'));

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

test('Fetch selections fulfilled', async () => {
  const action = { type: getAllSelections.fulfilled.type, payload: mockedSettingsData };
  const state = selectionsReducer(initialSettingsState, action);
  expect(state.loading).not.toBeTruthy();
  expect(state.error).toBe(undefined);
  expect(state.data).toEqual(mockedSettingsData);
  expect(state.filtered).toEqual(state.data);
});

test('Fetch selections rejected', async () => {
  const expectedWithError = {
    message: 'error message',
  };
  const action = { type: getAllSelections.rejected.type, error: expectedWithError };
  const state = selectionsReducer(initialSettingsState, action);
  expect(state.loading).not.toBeTruthy();
  expect(state.error).toEqual(expectedWithError.message);
  expect(state.data).toEqual([]);
  expect(state.filtered).toEqual(state.data);
});
