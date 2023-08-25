/**
 * @module SelectionsSlice
 */

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { SettingsPageItem, SettingsValidationError } from '../../consts/interfaces';
import { initialSettingsState } from './states';
import { deleteSelectionsThunk, getAllSelections, upsertSelectionsThunk } from './thunks';

const selectionsSlice = createSlice({
  name: 'selectionsSlice',
  initialState: initialSettingsState,
  reducers: {
    filterSelections: (state, action: PayloadAction<string>) => {
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
    builder.addCase(getAllSelections.fulfilled, (state, action) => {
      state.loading = false;
      state.filtered = state.data = action.payload;
      state.error = undefined;
    });
    builder.addCase(getAllSelections.rejected, (state, action) => {
      state.loading = false;
      state.filtered = state.data = [];
      state.error = action.error.message;
    });
    builder.addCase(upsertSelectionsThunk.pending, (state) => {
      state.loading = true;
      state.error = undefined;
      state.validationErrors = undefined;
    });
    builder.addCase(upsertSelectionsThunk.fulfilled, (state) => {
      state.loading = false;
      state.error = undefined;
    });
    builder.addCase(upsertSelectionsThunk.rejected, (state, action: any) => {
      state.loading = false;
      state.error = action.error.message;
      if (action.payload.type === 'validationErrors') {
        state.validationErrors = action.payload.errors as SettingsValidationError[];
      }
    });
    builder.addCase(deleteSelectionsThunk.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(deleteSelectionsThunk.fulfilled, (state, action) => {
      state.loading = false;
      state.error = undefined;
      state.data = state.data.filter(({ id }) => id !== action.payload);
      state.filtered = state.data;
    });
    builder.addCase(deleteSelectionsThunk.rejected, (state, action: any) => {
      state.loading = false;
      state.error = action.payload  ;
    });
  },
});

export const { filterSelections } = selectionsSlice.actions;

export const selectionsReducer = selectionsSlice.reducer;
