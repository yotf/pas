/**
 * @module OverviewSlice
 */

import { createSlice } from '@reduxjs/toolkit';
import { initialOverviewState } from './state';
import { getAllOverviewCenters, unschedulePO } from './thunks';

const overviewSlice = createSlice({
  name: 'overviewSlice',
  initialState: initialOverviewState,
  reducers: {
    clearData: (state) => {
      state.data = [];
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getAllOverviewCenters.fulfilled, (state, action) => {
      state.loading = false;
      state.data = action.payload;
      state.error = undefined;
    });
    builder.addCase(getAllOverviewCenters.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    });
    builder.addCase(getAllOverviewCenters.pending, (state) => {
      state.loading = true;
      state.error = undefined;
    });
    builder.addCase(unschedulePO.fulfilled, (state, action) => {
      state.loading = false;
      // state.data = action.payload;
      const unscheduledPOId = action.payload;
      state.data = state.data.map((owc) => {
        return {
          ...owc,
          pO_RoutingOperations: owc.pO_RoutingOperations.filter(
            (op) => op.productionOrder.id !== unscheduledPOId,
          ),
        };
      });
      state.error = undefined;
    });
    builder.addCase(unschedulePO.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    });
    builder.addCase(unschedulePO.pending, (state) => {
      state.loading = true;
      state.error = undefined;
    });
  },
});

export const { clearData } = overviewSlice.actions;
export const overviewReducer = overviewSlice.reducer;
