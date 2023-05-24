import { mockedSettingsData } from '@/modules/shared/test-config/helpers/consts/settings-page-mock';
import { mockedData } from '@/modules/shared/test-config/helpers/consts/sharedMocks';
import { filterPositions, positionsReducer } from '../slice';
import { initialSettingsState } from '../states';
import { getAllPositions } from '../thunks';

test('Positions - should return the initial state', () => {
  expect(positionsReducer(undefined, { type: undefined })).toEqual({
    loading: true,
    error: undefined,
    data: [],
    filtered: [],
  });
});

test('Positions - should filter an array', async () => {
  const previousState = {
    data: mockedData,
    filtered: mockedData,
  };

  const parameters = await positionsReducer(previousState, filterPositions('1'));

  expect(parameters).toEqual({
    filtered: [
      {
        name: 'test 1',
        id: 1,
      },
    ],
    data: mockedData,
  });
});

test('Fetch positions fulfilled', async () => {
  const action = { type: getAllPositions.fulfilled.type, payload: mockedSettingsData };
  const state = positionsReducer(initialSettingsState, action);
  expect(state.loading).not.toBeTruthy();
  expect(state.error).toBe(undefined);
  expect(state.data).toEqual(mockedSettingsData);
  expect(state.filtered).toEqual(state.data);
});

test('Fetch positions rejected', async () => {
  const expectedWithError = {
    message: 'error message',
  };
  const action = { type: getAllPositions.rejected.type, error: expectedWithError };
  const state = positionsReducer(initialSettingsState, action);
  expect(state.loading).not.toBeTruthy();
  expect(state.error).toEqual(expectedWithError.message);
  expect(state.data).toEqual([]);
  expect(state.filtered).toEqual(state.data);
});
