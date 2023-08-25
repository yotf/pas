/**
 * @module HolidaysSlice
 */

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { SettingsPageItem, SettingsValidationError } from '../../consts/interfaces';
import { initialSettingsState } from './states';
import { deleteHolidayThunk, getAllHolidays, upsertHolidayThunk } from './thunks';
import { dateFormatter } from '@/modules/shared/utils/utils';

const holidaysSlice = createSlice({
  name: 'holidaysSlice',
  initialState: initialSettingsState,
  reducers: {
    filterHolidays: (state, action: PayloadAction<string>) => {
      state.filtered = state.data.filter((uom: SettingsPageItem) => {
        const searchCriteria = action.payload?.toLowerCase();
        const holidayDateDottedFormat = uom.holidayDate
          ? dateFormatter(uom.holidayDate)
          : undefined;
        return (
          uom.code?.toLowerCase().includes(searchCriteria) ||
          uom.name.toLowerCase().includes(searchCriteria) ||
          holidayDateDottedFormat?.toLowerCase().includes(searchCriteria)
        );
      });
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getAllHolidays.fulfilled, (state, action) => {
      state.loading = false;
      state.filtered = state.data = action.payload;
      state.error = undefined;
    });
    builder.addCase(getAllHolidays.rejected, (state, action) => {
      state.loading = false;
      state.filtered = state.data = [];
      state.error = action.error.message;
    });
    builder.addCase(upsertHolidayThunk.pending, (state) => {
      state.loading = true;
      state.error = undefined;
      state.validationErrors = undefined;
    });
    builder.addCase(upsertHolidayThunk.fulfilled, (state) => {
      state.loading = false;
      state.error = undefined;
    });
    builder.addCase(upsertHolidayThunk.rejected, (state, action: any) => {
      state.loading = false;
      state.error = action.error.message;
      if (action.payload.type === 'validationErrors') {
        state.validationErrors = action.payload.errors as SettingsValidationError[];
      }
    });
    builder.addCase(deleteHolidayThunk.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(deleteHolidayThunk.fulfilled, (state, action) => {
      state.loading = false;
      state.error = undefined;
      state.data = state.data.filter(({ id }) => id !== action.payload);
      state.filtered = state.data;
    });
    builder.addCase(deleteHolidayThunk.rejected, (state, action: any) => {
      state.loading = false;
      state.error = action.payload;
    });
  },
});

export const { filterHolidays } = holidaysSlice.actions;

export const holidaysReducer = holidaysSlice.reducer;
