import {
  expectedSettingsPageResponse,
  mockedSettingsData,
} from '@/modules/shared/test-config/helpers/consts/settings-page-mock';
import { filterParameters, parametersReducer } from '../slice';
import { initialSettingsState } from '../states';
import { getAllParameters } from '../thunks';

test('Parameters - should return the initial state', () => {
  expect(parametersReducer(undefined, { type: undefined })).toEqual({
    loading: true,
    error: undefined,
    data: [],
    filtered: [],
  });
});

test('Parameters - should filter an array', async () => {
  const parameters = await parametersReducer(expectedSettingsPageResponse, filterParameters('1'));

  expect(parameters).toEqual({
    filtered: [
      {
        code: 'test 1',
        name: 'test 1',
        id: 1,
      },
    ],
    data: mockedSettingsData,
    loading: false,
    error: undefined,
  });
});

test('Fetch parameters fulfilled', async () => {
  const action = { type: getAllParameters.fulfilled.type, payload: mockedSettingsData };
  const state = parametersReducer(initialSettingsState, action);
  expect(state.loading).not.toBeTruthy();
  expect(state.error).toBe(undefined);
  expect(state.data).toEqual(mockedSettingsData);
  expect(state.filtered).toEqual(state.data);
});

test('Fetch parameters rejected', async () => {
  const expectedWithError = {
    message: 'error message',
  };
  const action = { type: getAllParameters.rejected.type, error: expectedWithError };
  const state = parametersReducer(initialSettingsState, action);
  expect(state.loading).not.toBeTruthy();
  expect(state.error).toEqual(expectedWithError.message);
  expect(state.data).toEqual([]);
  expect(state.filtered).toEqual(state.data);
});
