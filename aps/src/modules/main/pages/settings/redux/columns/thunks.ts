import { createAsyncThunk } from '@reduxjs/toolkit';
import { ColumnVisible } from '../../../columns/interfaces';
import ApiService from '@/modules/shared/services/api.service';
import { BASE_COLUMNS_API, SAVE_VISIBLE_COLUMNS_API } from '../../consts/apiUrl';

export const postColumnsConfigThunk = createAsyncThunk(
  SAVE_VISIBLE_COLUMNS_API + '-upsert',
  async (payload: ColumnVisible[], { rejectWithValue, dispatch }) => {
  
    try {
      const response = await ApiService.post<ColumnVisible[]>(SAVE_VISIBLE_COLUMNS_API, payload);
      return response.data;
    } catch (err: any) {
      const errors: { description: string }[] = err?.response?.data ?? [];
      if (errors.length) {
        return rejectWithValue({ type: 'validationErrors', errors });
      }
      return rejectWithValue(err.response ? err.response.status : err.message);
    }
  },
);
