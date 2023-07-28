import { createAsyncThunk } from '@reduxjs/toolkit';
import { Configuration } from './interfaces';
import ApiService from '@/modules/shared/services/api.service';
import { BASE_CONFIGURATION_API, CONFIGURATION_GET_LINKED_UOMS } from '../../consts/apiUrl';

export const postConfigurationThunk = createAsyncThunk(
  BASE_CONFIGURATION_API + '-upsert',
  async (payload: Configuration, { rejectWithValue, dispatch }) => {
    try {
      const response = await ApiService.post<Configuration>(BASE_CONFIGURATION_API, payload);
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

export const getConfiguration = createAsyncThunk(
  BASE_CONFIGURATION_API,
  async (_, { rejectWithValue }) => {
    try {
      const response = await ApiService.get<Configuration>(BASE_CONFIGURATION_API);
      const { data } = response;
      return data;
    } catch (err: any) {
      return rejectWithValue(err.response ? err.response.status : err.message);
    }
  },
);
