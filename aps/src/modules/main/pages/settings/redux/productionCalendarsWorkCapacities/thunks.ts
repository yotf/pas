/**
 * @module getProductionCalendarWorkCapacitiesThunks
 */
import ApiService from '@/modules/shared/services/api.service';
import { createAsyncThunk } from '@reduxjs/toolkit';
import {
  PRODUCTION_CALENDAR_GENERATE_API,
  PRODUCTION_CALENDAR_WORK_CAPACITIES_API,
} from '../../consts/apiUrl';
import { GenerateProductionCalendarFormData } from '../productionCalendars/interfaces';
import {
  ProductionCalendarPostResponse,
  ProductionCalendarWorkCapacitiesQueries,
  ProductionCalendarWorkCapacitiesResponse,
} from './interfaces';
/**
 * Gets work capacities and holidays for a production calendar
 */
export const getProductionCalendarWorkCapacities = createAsyncThunk(
  PRODUCTION_CALENDAR_WORK_CAPACITIES_API,
  async (queries: ProductionCalendarWorkCapacitiesQueries, { rejectWithValue }) => {
    if (!queries.id) throw Error();
    try {
      const response = await ApiService.get<ProductionCalendarWorkCapacitiesResponse>(
        `${PRODUCTION_CALENDAR_WORK_CAPACITIES_API}?workCenterId=${queries.id}&initialDate=${queries.initialDate}&finalDate=${queries.finalDate}`,
      );
      const { data } = response;
      return data;
    } catch (err: any) {
      return rejectWithValue(err.response ? err.response.status : err.message);
    }
  },
);
/** Generates a new production calendar */
export const generateProductionCalendar = createAsyncThunk(
  PRODUCTION_CALENDAR_GENERATE_API,
  async (payload: GenerateProductionCalendarFormData, { rejectWithValue }) => {
    try {
      const response = await ApiService.post<ProductionCalendarPostResponse[]>(
        PRODUCTION_CALENDAR_GENERATE_API,
        payload,
      );
      const { data } = response;
      return data;
    } catch (err: any) {
      if (err.length) {
        return rejectWithValue({ type: 'validationErrors', err });
      }
      return rejectWithValue(err.response ? err.response.status : err.message);
    }
  },
);
