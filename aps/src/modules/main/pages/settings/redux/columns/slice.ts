import { createSlice } from '@reduxjs/toolkit';
import { initialColumnsConfigState } from './states';
import { getOverviewColumns, postColumnsConfigThunk } from './thunks';

const columnsConfigSlice = createSlice({
  name: 'columnsConfigSlice',
  initialState: initialColumnsConfigState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(postColumnsConfigThunk.pending, (state) => {
      state.loading = true;
      state.error = undefined;
    });
    builder.addCase(postColumnsConfigThunk.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    });
    builder.addCase(postColumnsConfigThunk.fulfilled, (state, action) => {
      state.loading = false;
      state.error = undefined;
      state.data = action.payload;
    });

    builder.addCase(getOverviewColumns.fulfilled, (state, action) => {
      state.loading = false;
      state.data = action.payload;
      state.error = undefined;
    });

    builder.addCase(getOverviewColumns.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    });
    builder.addCase(getOverviewColumns.pending, (state) => {
      state.loading = true;
      state.error = undefined;
    });
  },
});

export const columnConfigReducer = columnsConfigSlice.reducer;
