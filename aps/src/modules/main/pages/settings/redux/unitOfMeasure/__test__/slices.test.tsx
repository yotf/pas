import {
  expectedSettingsPageResponse,
  mockedSettingsData,
} from '@/modules/shared/test-config/helpers/consts/settings-page-mock';
import { filterUnitOfMeasure, unitOfMeasureReducer } from '../slice';
import { initialSettingsState } from '../states';
import { getAllUnitsOfMeasure } from '../thunks';

test('should return the initial state', () => {
  expect(unitOfMeasureReducer(undefined, { type: undefined })).toEqual({
    loading: true,
    error: undefined,
    data: [],
    filtered: [],
  });
});

test('should filter an array', async () => {
  const unitOfMeasure = await unitOfMeasureReducer(
    expectedSettingsPageResponse,
    filterUnitOfMeasure('1'),
  );

  expect(unitOfMeasure).toEqual({
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

test('Fetch unit of measures fulfilled', async () => {
  const action = { type: getAllUnitsOfMeasure.fulfilled.type, payload: mockedSettingsData };
  const state = unitOfMeasureReducer(initialSettingsState, action);
  expect(state.loading).not.toBeTruthy();
  expect(state.error).toBe(undefined);
  expect(state.data).toEqual(mockedSettingsData);
  expect(state.filtered).toEqual(state.data);
});

test('Fetch unit of measures rejected', async () => {
  const expectedWithError = {
    message: 'error message',
  };
  const action = { type: getAllUnitsOfMeasure.rejected.type, error: expectedWithError };
  const state = unitOfMeasureReducer(initialSettingsState, action);
  expect(state.loading).not.toBeTruthy();
  expect(state.error).toEqual(expectedWithError.message);
  expect(state.data).toEqual([]);
  expect(state.filtered).toEqual(state.data);
});
