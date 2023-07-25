import { createSlice } from '@reduxjs/toolkit';
import { ProductionOrderNumberInitialState } from './states';
import { getProductionOrderNumbers } from './thunks';

const productionOrderNumbersSlice = createSlice({
  name: 'productionOrderNumbersSlice',
  initialState: ProductionOrderNumberInitialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getProductionOrderNumbers.fulfilled, (state, action) => {
      state.loading = false;
      state.error = undefined;
      state.data = action.payload;
    });
    builder.addCase(getProductionOrderNumbers.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    });
    builder.addCase(getProductionOrderNumbers.pending, (state) => {
      state.loading = true;
      state.error = undefined;
    });
  },
});

export const productionOrderNumbersReducer = productionOrderNumbersSlice.reducer;
