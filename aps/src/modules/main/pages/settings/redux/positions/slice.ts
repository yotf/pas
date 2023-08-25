/**
 * @module PositionsSlice
 */

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { SettingsPageItem, SettingsValidationError } from '../../consts/interfaces';
import { initialSettingsState } from './states';
import { deletePositionThunk, getAllPositions, upsertPositionThunk } from './thunks';

const positionsSlice = createSlice({
  name: 'positionsSlice',
  initialState: initialSettingsState,
  reducers: {
    filterPositions: (state, action: PayloadAction<string>) => {
      state.filtered = state.data.filter((uom: SettingsPageItem) => {
        const searchCriteria = action.payload?.toLowerCase();
        return uom.name.toLowerCase().includes(searchCriteria);
      });
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getAllPositions.fulfilled, (state, action) => {
      state.loading = false;
      state.filtered = state.data = action.payload;
      state.error = undefined;
    });
    builder.addCase(getAllPositions.rejected, (state, action) => {
      state.loading = false;
      state.filtered = state.data = [];
      state.error = action.error.message;
    });
    builder.addCase(upsertPositionThunk.pending, (state) => {
      state.loading = true;
      state.error = undefined;
      state.validationErrors = undefined;
    });
    builder.addCase(upsertPositionThunk.fulfilled, (state) => {
      state.loading = false;
      state.error = undefined;
    });
    builder.addCase(upsertPositionThunk.rejected, (state, action: any) => {
      state.loading = false;
      state.error = action.error.message;
      if (action.payload.type === 'validationErrors') {
        state.validationErrors = action.payload.errors as SettingsValidationError[];
      }
    });
    builder.addCase(deletePositionThunk.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(deletePositionThunk.fulfilled, (state, action) => {
      state.loading = false;
      state.error = undefined;
      state.data = state.data.filter(({ id }) => id !== action.payload);
      state.filtered = state.data;
    });
    builder.addCase(deletePositionThunk.rejected, (state, action: any) => {
      state.loading = false;
      state.error = action.payload;
    });
  },
});

export const { filterPositions } = positionsSlice.actions;

export const positionsReducer = positionsSlice.reducer;
