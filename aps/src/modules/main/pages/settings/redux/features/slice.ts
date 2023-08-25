/**
 * @module FeaturesSlice
 */

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { SettingsPageItem, SettingsValidationError } from '../../consts/interfaces';

import { initialSettingsState } from './states';
import { deleteFeatureThunk, getAllFeatures, upsertFeatureThunk } from './thunks';

const featuresSlice = createSlice({
  name: 'featuresSlice',
  initialState: initialSettingsState,
  reducers: {
    filterFeatures: (state, action: PayloadAction<string>) => {
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
    builder.addCase(getAllFeatures.fulfilled, (state, action) => {
      state.loading = false;
      state.filtered = state.data = action.payload;
      state.error = undefined;
    });
    builder.addCase(getAllFeatures.rejected, (state, action) => {
      state.loading = false;
      state.filtered = state.data = [];
      state.error = action.error.message;
    });
    builder.addCase(upsertFeatureThunk.pending, (state) => {
      state.loading = true;
      state.error = undefined;
      state.validationErrors = undefined;
    });
    builder.addCase(upsertFeatureThunk.fulfilled, (state) => {
      state.loading = false;
      state.error = undefined;
    });
    builder.addCase(upsertFeatureThunk.rejected, (state, action: any) => {
      state.loading = false;
      state.error = action.error.message;
      if (action.payload.type === 'validationErrors') {
        state.validationErrors = action.payload.errors as SettingsValidationError[];
      }
    });
    builder.addCase(deleteFeatureThunk.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(deleteFeatureThunk.fulfilled, (state, action) => {
      state.loading = false;
      state.error = undefined;
      state.data = state.data.filter(({ id }) => id !== action.payload);
      state.filtered = state.data;
    });
    builder.addCase(deleteFeatureThunk.rejected, (state, action: any) => {
      state.loading = false;
      state.error = action.payload;
    });
  },
});

export const { filterFeatures } = featuresSlice.actions;

export const featuresReducer = featuresSlice.reducer;
