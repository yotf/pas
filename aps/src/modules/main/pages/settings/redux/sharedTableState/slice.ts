/** @module SharedTableSlice */
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { initialSharedTableState } from './states';
/**
 * Used for managing pagination of tables on pages
 */
const sharedTableSlice = createSlice({
  name: 'sharedTableSlice',
  initialState: initialSharedTableState,
  reducers: {
    /** Resets pagination number anytime a user leaves a page with a table */
    resetPagination: (state) => {
      state.pageNumber = 1;
    },
    /** Updates pagination number */
    setPagination: (state, action: PayloadAction<number>) => {
      state.pageNumber = action.payload;
    },
  },
});

export const { resetPagination, setPagination } = sharedTableSlice.actions;

export const sharedTableReducer = sharedTableSlice.reducer;
