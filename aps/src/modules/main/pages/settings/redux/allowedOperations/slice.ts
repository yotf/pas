/**
 * @module AllowedOperationsSlice
 */

import { createSlice } from '@reduxjs/toolkit';
import { initialAllowedOperationsResponse } from './states';
import {
  getAllActiveOperationsByAllocationBased,
  getAllAllowedOperationsByWorkCenterId,
} from './thunks';

const allowedOperationsSlice = createSlice({
  name: 'allowedOperationsSlice',
  initialState: initialAllowedOperationsResponse,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getAllAllowedOperationsByWorkCenterId.fulfilled, (state, action) => {
      state.loading = false;
      state.dataByCenter = action.payload;
      state.error = undefined;
    });
    builder.addCase(getAllAllowedOperationsByWorkCenterId.rejected, (state, action) => {
      state.loading = false;
      state.dataByCenter = [];
      state.error = action.error.message;
    });
    builder.addCase(getAllAllowedOperationsByWorkCenterId.pending, (state) => {
      state.loading = true;
      state.error = undefined;
    });
    builder.addCase(getAllActiveOperationsByAllocationBased.fulfilled, (state, action) => {
      state.loading = false;
      state.dataByAllocation = action.payload;
      state.error = undefined;
    });
    builder.addCase(getAllActiveOperationsByAllocationBased.rejected, (state, action) => {
      state.loading = false;
      state.dataByAllocation = [];
      state.error = action.error.message;
    });
    builder.addCase(getAllActiveOperationsByAllocationBased.pending, (state) => {
      state.loading = true;
      state.error = undefined;
    });
  },
});

export const allowedOperationsReducer = allowedOperationsSlice.reducer;
