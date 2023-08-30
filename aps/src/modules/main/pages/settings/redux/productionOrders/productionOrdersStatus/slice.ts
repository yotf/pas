/**@module ProductionOrderStatusSlice */
import { createSlice } from '@reduxjs/toolkit';
import { initialProductionOrdersStatusState } from './state';
import { updateProductionOrderStatus } from './thunks';
import { AxiosErrorFormat } from '../../slice';

const productionOrderStatus = createSlice({
  name: 'productionOrderStatus',
  initialState: initialProductionOrdersStatusState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(updateProductionOrderStatus.fulfilled, (state) => {
      state.loading = false;
      state.error = undefined;
    });
    builder.addCase(updateProductionOrderStatus.rejected, (state, action) => {
      state.loading = false;
      state.error = (action.payload as AxiosErrorFormat).data;
    });
    builder.addCase(updateProductionOrderStatus.pending, (state) => {
      state.loading = true;
    });
  },
});
export const productionOrderStatusReducer = productionOrderStatus.reducer;
