import { mockedSettingsData } from '@/modules/shared/test-config/helpers/consts/settings-page-mock';
import { SettingsPagesResponse } from '../../../consts/interfaces';
import { customersReducer, filterCustomers } from '../slice';
import { initialSettingsState } from '../states';
import { getAllCustomers } from '../thunks';

test('Customers - should return the initial state', () => {
  expect(customersReducer(undefined, { type: undefined })).toEqual({
    loading: true,
    error: undefined,
    data: [],
    filtered: [],
  });
});

test('Customers - should filter an array', async () => {
  const previousState: SettingsPagesResponse = {
    data: mockedSettingsData,
    filtered: mockedSettingsData,
  };

  const departments = await customersReducer(previousState, filterCustomers('1'));

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

test('Fetch customers fulfilled', async () => {
  const action = { type: getAllCustomers.fulfilled.type, payload: mockedSettingsData };
  const state = customersReducer(initialSettingsState, action);
  expect(state.loading).not.toBeTruthy();
  expect(state.error).toBe(undefined);
  expect(state.data).toEqual(mockedSettingsData);
  expect(state.filtered).toEqual(state.data);
});

test('Fetch customers rejected', async () => {
  const expectedWithError = {
    message: 'error message',
  };
  const action = { type: getAllCustomers.rejected.type, error: expectedWithError };
  const state = customersReducer(initialSettingsState, action);
  expect(state.loading).not.toBeTruthy();
  expect(state.error).toEqual(expectedWithError.message);
  expect(state.data).toEqual([]);
  expect(state.filtered).toEqual(state.data);
});
