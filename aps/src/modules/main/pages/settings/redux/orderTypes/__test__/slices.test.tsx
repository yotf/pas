import { mockedSettingsData } from '@/modules/shared/test-config/helpers/consts/settings-page-mock';
import { SettingsPagesResponse } from '../../../consts/interfaces';
import { filterOrderTypes, orderTypesReducer } from '../slice';
import { initialSettingsState } from '../states';
import { getAllOrderTypes } from '../thunks';

test('Order Types - should return the initial state', () => {
  expect(orderTypesReducer(undefined, { type: undefined })).toEqual({
    loading: true,
    error: undefined,
    data: [],
    filtered: [],
  });
});

test('Order Types -should filter an array', async () => {
  const previousState: SettingsPagesResponse = {
    data: mockedSettingsData,
    filtered: mockedSettingsData,
  };

  const features = await orderTypesReducer(previousState, filterOrderTypes('1'));

  expect(features).toEqual({
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

test('Fetch order types fulfilled', async () => {
  const action = { type: getAllOrderTypes.fulfilled.type, payload: mockedSettingsData };
  const state = orderTypesReducer(initialSettingsState, action);
  expect(state.loading).not.toBeTruthy();
  expect(state.error).toBe(undefined);
  expect(state.data).toEqual(mockedSettingsData);
  expect(state.filtered).toEqual(state.data);
});

test('Fetch order types rejected', async () => {
  const expectedWithError = {
    message: 'error message',
  };
  const action = { type: getAllOrderTypes.rejected.type, error: expectedWithError };
  const state = orderTypesReducer(initialSettingsState, action);
  expect(state.loading).not.toBeTruthy();
  expect(state.error).toEqual(expectedWithError.message);
  expect(state.data).toEqual([]);
  expect(state.filtered).toEqual(state.data);
});
