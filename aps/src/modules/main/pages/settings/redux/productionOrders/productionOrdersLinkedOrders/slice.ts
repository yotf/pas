import { createSlice } from '@reduxjs/toolkit';
import { getLinkedProductionOrders } from './thunks';
import { LinkedOrdersInitialState } from './states';

const productonOrderLinkedOrdersSlice = createSlice({
  name: 'linkedProductionOrderSlice',
  initialState: LinkedOrdersInitialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getLinkedProductionOrders.fulfilled, (state, action) => {
      state.loading = false;
      state.error = undefined;
      state.data = action.payload;
    });

    builder.addCase(getLinkedProductionOrders.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    });
    builder.addCase(getLinkedProductionOrders.pending, (state) => {
      state.loading = true;
      state.error = undefined;
    });
  },
});

export const linkedProductionOrderReducer = productonOrderLinkedOrdersSlice.reducer;
