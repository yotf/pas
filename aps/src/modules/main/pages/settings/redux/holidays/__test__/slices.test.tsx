import {
  expectedSettingsPageResponse,
  mockedSettingsData,
} from '@/modules/shared/test-config/helpers/consts/settings-page-mock';
import { filterHolidays, holidaysReducer } from '../slice';
import { initialSettingsState } from '../states';
import { getAllHolidays } from '../thunks';

test('Holidays - should return the initial state', () => {
  expect(holidaysReducer(undefined, { type: undefined })).toEqual({
    loading: true,
    error: undefined,
    data: [],
    filtered: [],
  });
});

test('Holidays - should filter an array', async () => {
  const parameters = await holidaysReducer(expectedSettingsPageResponse, filterHolidays('1'));

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

test('Fetch holidays fulfilled', async () => {
  const action = { type: getAllHolidays.fulfilled.type, payload: mockedSettingsData };
  const state = holidaysReducer(initialSettingsState, action);
  expect(state.loading).not.toBeTruthy();
  expect(state.error).toBe(undefined);
  expect(state.data).toEqual(mockedSettingsData);
  expect(state.filtered).toEqual(state.data);
});

test('Fetch holidays rejected', async () => {
  const expectedWithError = {
    message: 'error message',
  };
  const action = { type: getAllHolidays.rejected.type, error: expectedWithError };
  const state = holidaysReducer(initialSettingsState, action);
  expect(state.loading).not.toBeTruthy();
  expect(state.error).toEqual(expectedWithError.message);
  expect(state.data).toEqual([]);
  expect(state.filtered).toEqual(state.data);
});
