import { createSlice } from '@reduxjs/toolkit';
import { initialColumnsConfigState } from './states';
import { getOverviewColumns, postColumnsConfigThunk } from './thunks';
import { AxiosErrorFormat } from '../slice';

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
      state.error = (action.payload as AxiosErrorFormat).data;
    });
    builder.addCase(postColumnsConfigThunk.fulfilled, (state, action) => {
      state.loading = false;
      state.error = undefined;
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
