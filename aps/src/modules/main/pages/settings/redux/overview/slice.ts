/**
 * @module OverviewSlice
 */

import { createSlice } from '@reduxjs/toolkit';
import { initialOverviewState } from './state';
import { getAllOverviewCenters } from './thunks';

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
  },
});

export const { clearData } = overviewSlice.actions;
export const overviewReducer = overviewSlice.reducer;
