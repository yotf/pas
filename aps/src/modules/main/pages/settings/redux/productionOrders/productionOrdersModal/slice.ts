/** @module ProductionOrderModalSlice */
import { createSlice } from '@reduxjs/toolkit';
import { POModalInitialState } from './states';
import { createProductionOrdersFromSalesOrder } from './thunks';
import { AxiosErrorFormat } from '../../slice';

const productionOrderModalSlice = createSlice({
  name: 'productionOrderModalSlice',
  initialState: POModalInitialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(createProductionOrdersFromSalesOrder.fulfilled, (state, action) => {
      state.loading = false;
      state.error = undefined;
      state.data = action.payload;
    });
    builder.addCase(createProductionOrdersFromSalesOrder.rejected, (state, action) => {
      state.loading = false;
      state.error = (action.payload as unknown as AxiosErrorFormat).data;
    });
    builder.addCase(createProductionOrdersFromSalesOrder.pending, (state) => {
      state.loading = true;
      state.error = undefined;
    });
  },
});

export const productionOrdersModalReducer = productionOrderModalSlice.reducer;
