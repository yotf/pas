/**
 * @module UnitOfMeasureSlice
 */

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { SettingsPageItem, SettingsValidationError } from '../../consts/interfaces';
import { initialSettingsState } from './states';
import { deleteUnitOfMeasureThunk, getAllUnitsOfMeasure, upsertUnitOfMeasureThunk } from './thunks';

const unitOfMeasureSlice = createSlice({
  name: 'unitOfMeasureSlice',
  initialState: initialSettingsState,
  reducers: {
    filterUnitOfMeasure: (state, action: PayloadAction<string>) => {
      state.filtered = state.data.filter((uom: SettingsPageItem) => {
        const searchCriteria = action.payload?.toLowerCase();
        return (
          uom.code?.toLowerCase().includes(searchCriteria) ||
          uom.name.toLowerCase().includes(searchCriteria)
        );
      });
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getAllUnitsOfMeasure.fulfilled, (state, action) => {
      state.loading = false;
      state.filtered = state.data = action.payload;
      state.error = undefined;
    });
    builder.addCase(getAllUnitsOfMeasure.rejected, (state, action) => {
      state.loading = false;
      state.filtered = state.data = [];
      state.error = action.error.message;
    });
    builder.addCase(upsertUnitOfMeasureThunk.pending, (state) => {
      state.loading = true;
      state.error = undefined;
      state.validationErrors = undefined;
    });
    builder.addCase(upsertUnitOfMeasureThunk.fulfilled, (state) => {
      state.loading = false;
      state.error = undefined;
    });
    builder.addCase(upsertUnitOfMeasureThunk.rejected, (state, action: any) => {
      state.loading = false;
      state.error = action.payload.errors;
      if (action.payload.type === 'validationErrors') {
        state.validationErrors = action.payload.errors as SettingsValidationError[];
      }
    });
    builder.addCase(deleteUnitOfMeasureThunk.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(deleteUnitOfMeasureThunk.fulfilled, (state, action) => {
      state.loading = false;
      state.error = undefined;
      state.data = state.data.filter(({ id }) => id !== action.payload);
      state.filtered = state.data;
    });
    builder.addCase(deleteUnitOfMeasureThunk.rejected, (state, action: any) => {
      state.loading = false;
      state.error = action.payload;
    });
  },
});

export const { filterUnitOfMeasure } = unitOfMeasureSlice.actions;

export const unitOfMeasureReducer = unitOfMeasureSlice.reducer;
