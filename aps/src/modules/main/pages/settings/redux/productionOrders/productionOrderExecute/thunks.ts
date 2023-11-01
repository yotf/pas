import ApiService from '@/modules/shared/services/api.service';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { PRODUCTION_ORDER_EXECUTE_API } from '../../../consts/apiUrl';
import { ExecutePOData } from './interfaces';

export const executeProductionOrderOperation = createAsyncThunk(
  PRODUCTION_ORDER_EXECUTE_API,
  async (payload: ExecutePOData, { rejectWithValue }) => {
    try {
      const response = await ApiService.put(PRODUCTION_ORDER_EXECUTE_API, payload.linkedPOId!, {
        id: payload.id,
        skipped: payload.skipped,
        executionDate: payload.executionDate,
      });
      const { data } = response;
      return data;
    } catch (err: any) {
      return rejectWithValue(err.response ? err.response : err.message);
    }
  },
);
