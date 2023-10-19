/**
 * @module OverviewThunks
 */

import { createAsyncThunk } from '@reduxjs/toolkit';
import { GET_OVERVIEW_API, OVERVIEW_UNSCHEDULE_API } from '../../consts/apiUrl';
import { OverviewFormData, OverviewWorkCenter } from './interfaces';
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

export const unschedulePO = createAsyncThunk(
  OVERVIEW_UNSCHEDULE_API,
  async (poID: number, { rejectWithValue }) => {
    try {
      const response = await ApiService.put(OVERVIEW_UNSCHEDULE_API, poID, '');
      const { data } = response;

      return data;
    } catch (err: any) {
      return rejectWithValue(err.response ? err.response.status : err.message);
    }
  },
);
