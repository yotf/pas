import {
  expectedSettingsPageResponse,
  mockedSettingsData,
} from '@/modules/shared/test-config/helpers/consts/settings-page-mock';
import { featuresReducer, filterFeatures } from '../slice';
import { initialSettingsState } from '../states';
import { getAllFeatures } from '../thunks';

test('Features- should return the initial state', () => {
  expect(featuresReducer(undefined, { type: undefined })).toEqual({
    loading: true,
    error: undefined,
    data: [],
    filtered: [],
  });
});

test('Features -should filter an array', async () => {
  const features = await featuresReducer(expectedSettingsPageResponse, filterFeatures('1'));

  expect(features).toEqual({
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

test('Fetch features fulfilled', async () => {
  const action = { type: getAllFeatures.fulfilled.type, payload: mockedSettingsData };
  const state = featuresReducer(initialSettingsState, action);
  expect(state.loading).not.toBeTruthy();
  expect(state.error).toBe(undefined);
  expect(state.data).toEqual(mockedSettingsData);
  expect(state.filtered).toEqual(state.data);
});

test('Fetch features rejected', async () => {
  const expectedWithError = {
    message: 'error message',
  };
  const action = { type: getAllFeatures.rejected.type, error: expectedWithError };
  const state = featuresReducer(initialSettingsState, action);
  expect(state.loading).not.toBeTruthy();
  expect(state.error).toEqual(expectedWithError.message);
  expect(state.data).toEqual([]);
  expect(state.filtered).toEqual(state.data);
});
