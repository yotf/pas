import ApiService from '@/modules/shared/services/api.service';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { ORDER_REPLACEMENT_REPLACE_ORDERS } from '../../../consts/apiUrl';
import { ReplaceProductionOrdersRequest } from '../interfaces';

export const performOrderReplacement = createAsyncThunk(
  ORDER_REPLACEMENT_REPLACE_ORDERS,
  async (orderReplacementInfo: ReplaceProductionOrdersRequest, { rejectWithValue }) => {
    try {
      const response = await ApiService.post(
        ORDER_REPLACEMENT_REPLACE_ORDERS,
        orderReplacementInfo,
      );
      return response.data;
    } catch (err: any) {
      return rejectWithValue(err.response ? err.response : err.message);
    }
  },
);
