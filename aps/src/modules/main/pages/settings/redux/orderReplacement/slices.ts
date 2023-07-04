/**
 * @module OrderReplacementSlice
 */
import { createSlice } from '@reduxjs/toolkit';
import { initialOrderPlacementState } from './state';
import {
  getOrderReplacement,
  getSalesOrderByCustomer,
  performOrderReplacement,
} from './thunks';

const orderReplacementSlice = createSlice({
  name: 'orderReplacementSlice',
  initialState: initialOrderPlacementState,
  reducers: {
    clearOrderReplacementData: (state) => {
      state.data = { inSalesOrders: [],outSalesOrders:[], inProductionOrders: [], outProductionOrders:[] };
      state.error = undefined;
    },
  },
  extraReducers(builder) {
    builder.addCase(getSalesOrderByCustomer.pending, (state) => {
      state.loading = true;
      state.error = undefined;
    });
    builder.addCase(getSalesOrderByCustomer.fulfilled, (state,action) => {
      state.loading = false;
      const { salesOrderType, data } = action.payload;
      if (salesOrderType === "in")
        state.data.inSalesOrders = data;
      else state.data.outSalesOrders = data;

    });
    builder.addCase(getSalesOrderByCustomer.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    });
    builder.addCase(getOrderReplacement.pending, (state) => {
      state.loading = true;
      state.error = undefined;
    });
    builder.addCase(getOrderReplacement.fulfilled, (state, action) => {
      state.loading = false;
      const { inProductionOrders, outProductionOrders } = action.payload
      state.data.inProductionOrders = inProductionOrders;
      state.data.outProductionOrders = outProductionOrders;
      state.error = undefined;
    });
    builder.addCase(getOrderReplacement.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    });
  // builder.addCase(getSalesOrderReplacementForm.pending, (state) => {
  //   state.loading = true;
  //   state.error = undefined;
  // });
  // builder.addCase(getSalesOrderReplacementForm.fulfilled, (state, action) => {
  //   state.loading = false;
  //   state.form = action.payload;
  //   state.error = undefined;
  // });
  // builder.addCase(getSalesOrderReplacementForm.rejected, (state, action) => {
  //   state.loading = false;
  //   state.error = action.error.message;
  // });
    builder.addCase(performOrderReplacement.pending, (state) => {
      state.loading = true;
      state.error = undefined;
    });
    builder.addCase(performOrderReplacement.fulfilled, (state) => {
      state.loading = false;
      state.error = undefined;
    });
    builder.addCase(performOrderReplacement.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    });
  },
});

export const { clearOrderReplacementData } = orderReplacementSlice.actions;

export const orderReplacementReducer = orderReplacementSlice.reducer;
