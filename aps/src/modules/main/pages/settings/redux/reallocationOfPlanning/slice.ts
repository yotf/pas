/**@module ReallocationOfPlanningSlice */
import { createSlice } from '@reduxjs/toolkit';
import { initialReallocationState } from './states';
import { upsertReallocation } from './thunks';

const reallocationOfPlanningSlice = createSlice({
  name: 'reallocationOfPlanningSlice',
  initialState: initialReallocationState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(upsertReallocation.fulfilled, (state) => {
      state.loading = false;
      state.error = undefined;
    });
    builder.addCase(upsertReallocation.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    });
    builder.addCase(upsertReallocation.pending, (state) => {
      state.loading = true;
      state.error = undefined;
    });
  },
});

export const reallocationReducer = reallocationOfPlanningSlice.reducer;
