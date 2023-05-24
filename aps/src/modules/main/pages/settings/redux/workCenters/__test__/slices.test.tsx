import { mockedWorkCentersData } from '@/modules/main/pages/workCenter/__test__/consts';
import { waitFor } from '@testing-library/react';
import { WorkCentersResponse } from '../interfaces';
import { filterWorkCenters, workCentersReducer } from '../slice';
import { getAllWorkCenters } from '../thunks';

const mockedWorkCenterState = { loading: true, error: undefined, data: [], filtered: [] };
describe('Work center slices', () => {
  test('should return the initial state', () => {
    expect(workCentersReducer(undefined, { type: undefined })).toEqual({
      loading: true,
      error: undefined,
      data: [],
      filtered: [],
    });
  });

  test('should filter an array', async () => {
    const previousState: WorkCentersResponse = {
      data: mockedWorkCentersData,
      filtered: mockedWorkCentersData,
      loading: false,
      error: undefined,
    };

    const { filtered } = await waitFor(() =>
      workCentersReducer(previousState, filterWorkCenters('new_operation')),
    );
    expect(filtered[0]).toEqual(mockedWorkCentersData[1]);
  });

  test('fetch fulfilled', async () => {
    const action = { type: getAllWorkCenters.fulfilled.type, payload: mockedWorkCentersData };
    const state = workCentersReducer(mockedWorkCenterState, action);
    expect(state.loading).not.toBeTruthy();
    expect(state.error).toBe(undefined);
    expect(state.data).toEqual(mockedWorkCentersData);
    expect(state.filtered).toEqual(state.data);
  });

  test('fetch rejected', async () => {
    const expectedWithError = {
      message: 'error message',
    };
    const action = { type: getAllWorkCenters.rejected.type, error: expectedWithError };
    const state = workCentersReducer(mockedWorkCenterState, action);
    expect(state.loading).not.toBeTruthy();
    expect(state.error).toEqual(expectedWithError.message);
    expect(state.data).toEqual([]);
    expect(state.filtered).toEqual(state.data);
  });
});
