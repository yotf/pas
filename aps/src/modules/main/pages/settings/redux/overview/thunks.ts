/**
 * @module OverviewThunks
 */

import { createAsyncThunk } from '@reduxjs/toolkit';
import { BASE_OVERVIEW_API, GET_VISIBLE_COLUMNS_API } from '../../consts/apiUrl';
import { OverviewColumnResponse, OverviewFormData, OverviewWorkCenter } from './interfaces';
import ApiService from '@/modules/shared/services/api.service';
/** Gets overview data */
export const getAllOverviewCenters = createAsyncThunk(
  BASE_OVERVIEW_API,
  async (filters: OverviewFormData, { rejectWithValue }) => {
    try {
      const response = await ApiService.post<OverviewWorkCenter[]>(BASE_OVERVIEW_API, filters);
      const { data } = response;
      return data;
    } catch (err: any) {
      return rejectWithValue(err.response ? err.response.status : err.message);
    }
  },
);


