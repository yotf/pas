/**
 * @module OverviewThunks
 */

import { createAsyncThunk } from '@reduxjs/toolkit';
import { BASE_OVERVIEW_API, GET_OVERVIEW_API, GET_VISIBLE_COLUMNS_API } from '../../consts/apiUrl';
import { OverviewColumnResponse, OverviewFormData, OverviewWorkCenter } from './interfaces';
import ApiService from '@/modules/shared/services/api.service';
import { removeFalsyProperties } from '@/modules/shared/utils/utils';
/** Gets overview data */
export const getAllOverviewCenters = createAsyncThunk(
  GET_OVERVIEW_API,
  async (filters: OverviewFormData, { rejectWithValue }) => {
    try {
      const filterWithoutFalsy = removeFalsyProperties(filters);
      const response = await ApiService.post<OverviewWorkCenter[]>(
        GET_OVERVIEW_API,
        filterWithoutFalsy,
      );

      const { data } = response;
      return data;
    } catch (err: any) {
      return rejectWithValue(err.response ? err.response.status : err.message);
    }
  },
);
