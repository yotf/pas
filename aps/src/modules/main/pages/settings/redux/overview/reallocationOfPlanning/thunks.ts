/**@module ReallocationOfPlanningThunks */
import { createAsyncThunk } from '@reduxjs/toolkit';
import {
  GET_OVERVIEW_API,
  OVERVIEW_UNSCHEDULE_API,
  OVERVIEW_REALLOCATE_API,
} from '../../../consts/apiUrl';
import ApiService from '@/modules/shared/services/api.service';
export const reallocateOperation = createAsyncThunk(
  OVERVIEW_REALLOCATE_API,
  async (data: any, { rejectWithValue }) => {
    try {
      const response = await ApiService.post(OVERVIEW_REALLOCATE_API, data);
      const { data: responseData } = response;
      return responseData;
    } catch (err: any) {
      return rejectWithValue(err.response ? err.response.status : err.message);
    }
  },
);
