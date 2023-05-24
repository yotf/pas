import { mockedSettingsData } from '@/modules/shared/test-config/helpers/consts/settings-page-mock';
import { SettingsPagesResponse } from '../../../consts/interfaces';
import { departmentsReducer, filterDepartments } from '../slice';
import { initialSettingsState } from '../states';
import { getAllDepartments } from '../thunks';

test('Departments - should return the initial state', () => {
  expect(departmentsReducer(undefined, { type: undefined })).toEqual({
    loading: true,
    error: undefined,
    data: [],
    filtered: [],
  });
});

test('Departments - should filter an array', async () => {
  const previousState: SettingsPagesResponse = {
    data: mockedSettingsData,
    filtered: mockedSettingsData,
  };

  const departments = await departmentsReducer(previousState, filterDepartments('1'));

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

test('Fetch departments fulfilled', async () => {
  const action = { type: getAllDepartments.fulfilled.type, payload: mockedSettingsData };
  const state = departmentsReducer(initialSettingsState, action);
  expect(state.loading).not.toBeTruthy();
  expect(state.error).toBe(undefined);
  expect(state.data).toEqual(mockedSettingsData);
  expect(state.filtered).toEqual(state.data);
});

test('Fetch departments rejected', async () => {
  const expectedWithError = {
    message: 'error message',
  };
  const action = { type: getAllDepartments.rejected.type, error: expectedWithError };
  const state = departmentsReducer(initialSettingsState, action);
  expect(state.loading).not.toBeTruthy();
  expect(state.error).toEqual(expectedWithError.message);
  expect(state.data).toEqual([]);
  expect(state.filtered).toEqual(state.data);
});
