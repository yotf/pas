/**
 * @module MaterialsSlice
 */

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { SettingsPageItem, SettingsValidationError } from '../../consts/interfaces';
import { initialSettingsState } from './states';
import { deleteMaterialGroups, getAllMaterialGroups, upsertMaterialGroups } from './thunks';

const materialGroups = createSlice({
  name: 'materialGroups',
  initialState: initialSettingsState,
  reducers: {
    filterMaterialGroups: (state, action: PayloadAction<string>) => {
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
    builder.addCase(getAllMaterialGroups.fulfilled, (state, action) => {
      state.loading = false;
      state.filtered = state.data = action.payload;
      state.error = undefined;
    });
    builder.addCase(getAllMaterialGroups.rejected, (state, action) => {
      state.loading = false;
      state.filtered = state.data = [];
      state.error = action.error.message;
    });
    builder.addCase(upsertMaterialGroups.pending, (state) => {
      state.loading = true;
      state.error = undefined;
      state.validationErrors = undefined;
    });
    builder.addCase(upsertMaterialGroups.fulfilled, (state) => {
      state.loading = false;
      state.error = undefined;
    });
    builder.addCase(upsertMaterialGroups.rejected, (state, action: any) => {
      state.loading = false;
      state.error = action.error.message;
      if (action.payload.type === 'validationErrors') {
        state.validationErrors = action.payload.errors as SettingsValidationError[];
      }
    });
    builder.addCase(deleteMaterialGroups.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(deleteMaterialGroups.fulfilled, (state, action) => {
      state.loading = false;
      state.error = undefined;
      state.data = state.data.filter(({ id }) => id !== action.payload);
      state.filtered = state.data;
    });
    builder.addCase(deleteMaterialGroups.rejected, (state, action: any) => {
      state.loading = false;
      state.error = action.payload;
    });
  },
});

export const { filterMaterialGroups } = materialGroups.actions;

export const materialGroupsReducer = materialGroups.reducer;
