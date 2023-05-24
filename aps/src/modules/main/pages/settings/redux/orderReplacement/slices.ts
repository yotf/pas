/**
 * @module OrderReplacementSlice
 */
import { createSlice } from '@reduxjs/toolkit';
import { initialOrderPlacementState } from './state';
import {
  getOrderReplacement,
  getSalesOrderReplacementForm,
  performOrderReplacement,
} from './thunks';

const orderReplacementSlice = createSlice({
  name: 'orderReplacementSlice',
  initialState: initialOrderPlacementState,
  reducers: {
    clearOrderReplacementData: (state) => {
      state.data = { outProductionOrders: [], inProductionOrders: [] };
      state.error = undefined;
    },
  },
  extraReducers(builder) {
    builder.addCase(getOrderReplacement.pending, (state) => {
      state.loading = true;
      state.error = undefined;
    });
    builder.addCase(getOrderReplacement.fulfilled, (state, action) => {
      state.loading = false;
      state.data = action.payload;
      state.error = undefined;
    });
    builder.addCase(getOrderReplacement.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    });
    builder.addCase(getSalesOrderReplacementForm.pending, (state) => {
      state.loading = true;
      state.error = undefined;
    });
    builder.addCase(getSalesOrderReplacementForm.fulfilled, (state, action) => {
      state.loading = false;
      state.form = action.payload;
      state.error = undefined;
    });
    builder.addCase(getSalesOrderReplacementForm.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    });
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
