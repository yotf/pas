import { createSlice } from '@reduxjs/toolkit';
import { AxiosErrorFormat } from '../../slice';

import BaseResponse from '@/modules/shared/services/interfaces';
import { performOrderReplacement } from './thunks';

const performOrderReplacementSlice = createSlice({
  name: 'performOrderReplacement',
  initialState: {
    loading: false,
    error: undefined,
  } as BaseResponse,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(performOrderReplacement.pending, (state) => {
      state.loading = true;
      state.error = undefined;
    });
    builder.addCase(performOrderReplacement.fulfilled, (state) => {
      state.loading = false;
      state.error = undefined;
    });
    builder.addCase(performOrderReplacement.rejected, (state, action) => {
      state.loading = false;
      state.error = (action.payload as AxiosErrorFormat).data;
    });
  },
});

export const performOrderReplacementReducer = performOrderReplacementSlice.reducer;
