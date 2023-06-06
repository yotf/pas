/**
 * @module ProductionCalendarWorkCapacitiesSlice
 */

import { createSlice } from '@reduxjs/toolkit';
import { initialPCWorkCapacitiesState } from './states';
import { generateProductionCalendar, getProductionCalendarWorkCapacities } from './thunks';
import { ProductionCalendarPostResponse } from './interfaces';

const productionCalendarsWorkCapacitiesSlice = createSlice({
  name: 'productionCalendarsWorkCapacitiesSlice',
  initialState: initialPCWorkCapacitiesState,
  reducers: {
    clearState: (state) => {
      state.workCapacities = [];
      state.holidays = [];
      state.error = undefined;
      state.loading = true;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getProductionCalendarWorkCapacities.fulfilled, (state, action) => {
      state.loading = false;
      state.holidays = action.payload.holidays.filter((holiday) => holiday.isActive);
      state.workCapacities = action.payload.workCapacities;
      state.error = undefined;
    });
    builder.addCase(getProductionCalendarWorkCapacities.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(getProductionCalendarWorkCapacities.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    });
    builder.addCase(generateProductionCalendar.fulfilled, (state, action) => {
      state.loading = false;
      state.error = undefined;
      state.productionCalendarIds = action.payload.map((prod:ProductionCalendarPostResponse) => prod.productionCalendarBaseInfoDto.id);
    });
    builder.addCase(generateProductionCalendar.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    });
    builder.addCase(generateProductionCalendar.pending, (state) => {
      state.loading = true;
    });
  },
});
export const { clearState } = productionCalendarsWorkCapacitiesSlice.actions;
export const productionCalendarsWorkCapacitesReducer =
  productionCalendarsWorkCapacitiesSlice.reducer;
