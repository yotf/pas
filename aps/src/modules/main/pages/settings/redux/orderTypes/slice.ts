/**
 * @module OrderTypesSlice
 */

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { SettingsPageItem, SettingsValidationError } from '../../consts/interfaces';
import { initialSettingsState } from './states';
import { deleteOrderTypesThunk, getAllOrderTypes, upsertOrderTypes } from './thunks';

const orderTypesSlice = createSlice({
  name: 'orderTypesSlice',
  initialState: initialSettingsState,
  reducers: {
    filterOrderTypes: (state, action: PayloadAction<string>) => {
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
    builder.addCase(getAllOrderTypes.fulfilled, (state, action) => {
      state.loading = false;
      state.filtered = state.data = action.payload;
      state.error = undefined;
    });
    builder.addCase(getAllOrderTypes.rejected, (state, action) => {
      state.loading = false;
      state.filtered = state.data = [];
      state.error = action.error.message;
    });
    builder.addCase(upsertOrderTypes.pending, (state) => {
      state.loading = true;
      state.error = undefined;
      state.validationErrors = undefined;
    });
    builder.addCase(upsertOrderTypes.fulfilled, (state) => {
      state.loading = false;
      state.error = undefined;
    });
    builder.addCase(upsertOrderTypes.rejected, (state, action: any) => {
      state.loading = false;
      state.error = action.error.message;
      if (action.payload.type === 'validationErrors') {
        state.validationErrors = action.payload.errors as SettingsValidationError[];
      }
    });
    builder.addCase(deleteOrderTypesThunk.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(deleteOrderTypesThunk.fulfilled, (state, action) => {
      state.loading = false;
      state.error = undefined;
      state.data = state.data.filter(({ id }) => id !== action.payload);
      state.filtered = state.data;
    });
    builder.addCase(deleteOrderTypesThunk.rejected, (state, action: any) => {
      state.loading = false;
      state.error = action.payload;
    });
  },
});

export const { filterOrderTypes } = orderTypesSlice.actions;

export const orderTypesReducer = orderTypesSlice.reducer;
