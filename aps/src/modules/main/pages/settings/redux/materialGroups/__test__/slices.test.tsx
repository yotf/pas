import { mockedSettingsData } from '@/modules/shared/test-config/helpers/consts/settings-page-mock';
import { SettingsPagesResponse } from '../../../consts/interfaces';
import { filterMaterialGroups, materialGroupsReducer } from '../slice';
import { initialSettingsState } from '../states';
import { getAllMaterialGroups } from '../thunks';

test('Material Groups - should return the initial state', () => {
  expect(materialGroupsReducer(undefined, { type: undefined })).toEqual({
    loading: true,
    error: undefined,
    data: [],
    filtered: [],
  });
});

test('Material Groups - should filter an array', async () => {
  const previousState: SettingsPagesResponse = {
    data: mockedSettingsData,
    filtered: mockedSettingsData,
  };

  const parameters = await materialGroupsReducer(previousState, filterMaterialGroups('1'));

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

test('Fetch material groups fulfilled', async () => {
  const action = { type: getAllMaterialGroups.fulfilled.type, payload: mockedSettingsData };
  const state = materialGroupsReducer(initialSettingsState, action);
  expect(state.loading).not.toBeTruthy();
  expect(state.error).toBe(undefined);
  expect(state.data).toEqual(mockedSettingsData);
  expect(state.filtered).toEqual(state.data);
});

test('Fetch material groups rejected', async () => {
  const expectedWithError = {
    message: 'error message',
  };
  const action = { type: getAllMaterialGroups.rejected.type, error: expectedWithError };
  const state = materialGroupsReducer(initialSettingsState, action);
  expect(state.loading).not.toBeTruthy();
  expect(state.error).toEqual(expectedWithError.message);
  expect(state.data).toEqual([]);
  expect(state.filtered).toEqual(state.data);
});
