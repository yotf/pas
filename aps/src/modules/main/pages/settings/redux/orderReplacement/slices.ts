/**
 * @module OrderReplacementSlice
 */
import { createSlice } from '@reduxjs/toolkit';
import { initialOrderPlacementState } from './state';
import { getOrderReplacement, getSalesOrderByCustomer } from './thunks';
import { AxiosErrorFormat } from '../slice';

const orderReplacementSlice = createSlice({
  name: 'orderReplacementSlice',
  initialState: initialOrderPlacementState,
  reducers: {
    clearOrderReplacementData: (state) => {
      state.data = {
        inSalesOrders: [],
        outSalesOrders: [],
        inProductionOrders: [],
        outProductionOrders: [],
      };
      state.error = undefined;
    },
  },
  extraReducers(builder) {
    builder.addCase(getSalesOrderByCustomer.pending, (state) => {
      state.loading = true;
      state.error = undefined;
    });
    builder.addCase(getSalesOrderByCustomer.fulfilled, (state, action) => {
      // state.loading = false;
      const { salesOrderType, data } = action.payload;
      if (salesOrderType === 'in') state.data.inSalesOrders = data;
      else state.data.outSalesOrders = data;
    });
    builder.addCase(getSalesOrderByCustomer.rejected, (state, action) => {
      //  state.loading = false;
      state.error = (action.payload as AxiosErrorFormat).data;
    });
    builder.addCase(getOrderReplacement.pending, (state) => {
      state.loading = true;
      state.error = undefined;
    });
    builder.addCase(getOrderReplacement.fulfilled, (state, action) => {
      state.loading = false;
      const { inProductionOrders, outProductionOrders } = action.payload;
      state.data.inProductionOrders = inProductionOrders;
      state.data.outProductionOrders = outProductionOrders;
      state.error = undefined;
    });
    builder.addCase(getOrderReplacement.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    });
  },
});

export const { clearOrderReplacementData } = orderReplacementSlice.actions;

export const orderReplacementReducer = orderReplacementSlice.reducer;
