/**@module StatisticsSlice */
import { createSlice } from '@reduxjs/toolkit';
import { StatisticsGeneratedData } from './interfaces';
import { initialStatisticsState } from './states';
import { getDelayedOrders, getStatistics } from './thunks';

const statisticsSlice = createSlice({
  name: 'statisticsSlice',
  initialState: initialStatisticsState,
  reducers: {
    clearStatistics: (state) => {
      state.data = {} as StatisticsGeneratedData;
      state.delayedOrders = [];
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getStatistics.fulfilled, (state, action) => {
      state.loading = false;
      state.error = undefined;
      state.data = action.payload;
    });
    builder.addCase(getStatistics.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(getStatistics.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    });
    builder.addCase(getDelayedOrders.fulfilled, (state, action) => {
      state.loading = false;
      state.error = undefined;
      state.delayedOrders = action.payload;
    });
    builder.addCase(getDelayedOrders.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(getDelayedOrders.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    });
  },
});

export const { clearStatistics } = statisticsSlice.actions;

export const statisticsReducer = statisticsSlice.reducer;
