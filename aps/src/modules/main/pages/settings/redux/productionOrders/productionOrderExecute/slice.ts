import { createSlice } from '@reduxjs/toolkit';
import { executeProductionOrderOperation } from './thunks';
import { AxiosErrorFormat } from '../../slice';
import { initialProductionExecutionStatus } from './states';

const productionOrderExecution = createSlice({
  name: 'productionOrderExecution',
  initialState: initialProductionExecutionStatus,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(executeProductionOrderOperation.fulfilled, (state) => {
      state.loading = false;
      state.error = undefined;
    });
    builder.addCase(executeProductionOrderOperation.rejected, (state, action) => {
      state.loading = false;
      state.error = (action.payload as AxiosErrorFormat).data;
    });
    builder.addCase(executeProductionOrderOperation.pending, (state) => {
      state.loading = true;
    });
  },
});

export const productionOrderExecutionReducer = productionOrderExecution.reducer;
