/**
 * @module ArticlesSlice
 */

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { SettingsPageItem, SettingsValidationError } from '../../consts/interfaces';

import { initialSettingsState } from './states';
import { deleteArticleThunk, getAllArticles, upsertArticleThunk } from './thunks';

const articlesSlice = createSlice({
  name: 'articlesSlice',
  initialState: initialSettingsState,
  reducers: {
    /**
     *
     * @param state State of type {@link SettingsInterfaces.SettingsPagesResponse}
     * @param action Action with payload type {@link SettingsInterfaces.SettingsPagesResponse}
     * @returns Filtered articles by values inputed in search
     */
    filterArticles: (state, action: PayloadAction<string>) => {
      state.filtered = state.data.filter((article: SettingsPageItem) => {
        const searchCriteria = action.payload?.toLowerCase();
        return (
          article.code?.toLowerCase().includes(searchCriteria) ||
          article.name.toLowerCase().includes(searchCriteria)
        );
      });
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getAllArticles.fulfilled, (state, action) => {
      state.loading = false;
      state.filtered = state.data = action.payload;
      state.error = undefined;
    });
    builder.addCase(getAllArticles.rejected, (state, action) => {
      state.loading = false;
      state.filtered = state.data = [];
      state.error = action.error.message;
    });
    builder.addCase(upsertArticleThunk.pending, (state) => {
      state.loading = true;
      state.error = undefined;
      state.validationErrors = undefined;
    });
    builder.addCase(upsertArticleThunk.fulfilled, (state) => {
      state.loading = false;
      state.error = undefined;
    });
    builder.addCase(upsertArticleThunk.rejected, (state, action: any) => {
      state.loading = false;
      state.error = action.error.message;
      if (action.payload.type === 'validationErrors') {
        state.validationErrors = action.payload.errors as SettingsValidationError[];
      }
    });
    builder.addCase(deleteArticleThunk.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(deleteArticleThunk.fulfilled, (state, action) => {
      state.loading = false;
      state.error = undefined;
      state.data = state.data.filter(({ id }) => id !== action.payload);
      state.filtered = state.data;
    });
    builder.addCase(deleteArticleThunk.rejected, (state, action: any) => {
      state.loading = false;
      state.error = action.error.message;
    });
  },
});

export const { filterArticles } = articlesSlice.actions;

export const articlesReducer = articlesSlice.reducer;
