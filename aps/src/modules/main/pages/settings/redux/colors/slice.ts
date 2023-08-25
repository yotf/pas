/**
 * @module ColorsSlice
 */

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { SettingsPageItem, SettingsValidationError } from '../../consts/interfaces';

import { initialSettingsState } from './states';
import { deleteColorsThunk, getAllColors, upsertColorsThunk } from './thunks';

const colorsSlice = createSlice({
  name: 'colorsSlice',
  initialState: initialSettingsState,
  reducers: {
    /**
     *
     * @param state State of type {@link SettingsInterfaces.SettingsPagesResponse}
     * @param action Action with payload type {@link SettingsInterfaces.SettingsPagesResponse}
     * Filters colors by values inputed in search input
     */
    filterColors: (state, action: PayloadAction<string>) => {
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
    builder.addCase(getAllColors.fulfilled, (state, action) => {
      state.loading = false;
      state.filtered = state.data = action.payload;
      state.error = undefined;
    });
    builder.addCase(getAllColors.rejected, (state, action) => {
      state.loading = false;
      state.filtered = state.data = [];
      state.error = action.error.message;
    });
    builder.addCase(upsertColorsThunk.pending, (state) => {
      state.loading = true;
      state.error = undefined;
      state.validationErrors = undefined;
    });
    builder.addCase(upsertColorsThunk.fulfilled, (state) => {
      state.loading = false;
      state.error = undefined;
    });
    builder.addCase(upsertColorsThunk.rejected, (state, action: any) => {
      state.loading = false;
      state.error = action.error.message;
      if (action.payload.type === 'validationErrors') {
        state.validationErrors = action.payload.errors as SettingsValidationError[];
      }
    });
    builder.addCase(deleteColorsThunk.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(deleteColorsThunk.fulfilled, (state, action) => {
      state.loading = false;
      state.error = undefined;
      state.data = state.data.filter(({ id }) => id !== action.payload);
      state.filtered = state.data;
    });
    builder.addCase(deleteColorsThunk.rejected, (state, action: any) => {
      state.loading = false;
      state.error = action.payload;
    });
  },
});

export const { filterColors } = colorsSlice.actions;

export const colorsReducer = colorsSlice.reducer;
