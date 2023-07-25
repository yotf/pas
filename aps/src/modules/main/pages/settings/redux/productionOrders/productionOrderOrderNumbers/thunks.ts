import ApiService from '@/modules/shared/services/api.service';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { ProductionOrderNumberResponse } from './states';
import { PRODUCTION_ORDER_GET_ORDER_NUMBERS } from '../../../consts/apiUrl';

export const getProductionOrderNumbers = createAsyncThunk(
  PRODUCTION_ORDER_GET_ORDER_NUMBERS,
  async (_, { rejectWithValue }) => {
    try {
      const response = await ApiService.get<ProductionOrderNumberResponse[]>(
        PRODUCTION_ORDER_GET_ORDER_NUMBERS,
      );
      const { data } = response;
      return data;
    } catch (err: any) {
      return rejectWithValue(err.reponse ? err.response.status : err.message);
    }
  },
);
