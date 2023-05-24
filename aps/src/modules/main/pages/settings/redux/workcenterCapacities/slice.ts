/**@module WorkCenterCapacitiesSlice */
import { createSlice } from '@reduxjs/toolkit';
import { initialWorkCapacitiesState } from './states';
import { getAllWorkCapacitiesByWorkCenterId } from './thunks';

const workCapacitiesSlice = createSlice({
  name: 'workCapacitiesSlice',
  initialState: initialWorkCapacitiesState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getAllWorkCapacitiesByWorkCenterId.fulfilled, (state, action) => {
      state.loading = false;
      state.data = action.payload;
      state.error = undefined;
    });
    builder.addCase(getAllWorkCapacitiesByWorkCenterId.rejected, (state, action) => {
      state.loading = false;
      state.data = [];
      state.error = action.error.message;
    });
    builder.addCase(getAllWorkCapacitiesByWorkCenterId.pending, (state) => {
      state.loading = true;
      state.error = undefined;
    });
  },
});

export const workCapacitiesReducer = workCapacitiesSlice.reducer;
