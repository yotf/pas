import { mockedOperationsData } from '@/modules/main/pages/operations/__test__/consts';
import { waitFor } from '@testing-library/react';
import { OperationsResponse } from '../interfaces';
import { filterOperations, operationsReducer } from '../slice';
import { getAllOperations } from '../thunks';

const mockedOperationsState = { loading: true, error: undefined, data: [], filtered: [] };
describe('Operations slices', () => {
  test('should return the initial state', () => {
    expect(operationsReducer(undefined, { type: undefined })).toEqual({
      loading: true,
      error: undefined,
      data: [],
      filtered: [],
    });
  });

  test('should filter an array', async () => {
    const previousState: OperationsResponse = {
      data: mockedOperationsData,
      filtered: mockedOperationsData,
      loading: false,
      error: undefined,
    };

    const { filtered } = await waitFor(() =>
      operationsReducer(previousState, filterOperations('new_operation')),
    );
    expect(filtered[0]).toEqual(mockedOperationsData[1]);
  });

  test('fetch fulfilled', async () => {
    const action = { type: getAllOperations.fulfilled.type, payload: mockedOperationsData };
    const state = operationsReducer(mockedOperationsState, action);
    expect(state.loading).not.toBeTruthy();
    expect(state.error).toBe(undefined);
    expect(state.data).toEqual(mockedOperationsData);
    expect(state.filtered).toEqual(state.data);
  });

  test('fetch rejected', async () => {
    const expectedWithError = {
      message: 'error message',
    };
    const action = { type: getAllOperations.rejected.type, error: expectedWithError };
    const state = operationsReducer(mockedOperationsState, action);
    expect(state.loading).not.toBeTruthy();
    expect(state.error).toEqual(expectedWithError.message);
    expect(state.data).toEqual([]);
    expect(state.filtered).toEqual(state.data);
  });
});
