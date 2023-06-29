/**@module StatisticsThunks */
import { createAsyncThunk } from '@reduxjs/toolkit';
import { mockedDelayedOrders } from '../../../statistics/mockedStatisticsData';
import { BASE_STATISTICS_API, STATISTICS_DELAYED_ORDERS_API, STATISTICS_GENERATE_DATA_API } from '../../consts/apiUrl';
import { DelayedOrder, StatisticsFormData, StatisticsGeneratedData } from './interfaces';
import ApiService from '@/modules/shared/services/api.service';
/** Gets statistics data for overview section and work center table for requested work centers, in the selected time period */
export const getStatistics = createAsyncThunk(
  STATISTICS_GENERATE_DATA_API,
  async (queries: StatisticsFormData, { rejectWithValue }) => {
    try {
      const response = await ApiService.post<StatisticsGeneratedData>(STATISTICS_GENERATE_DATA_API, queries);
      const { data } = response;
      return data;
    } catch (err: any) {
      return rejectWithValue(err.response ? err.response.status : err.message);
    }
  },
);
/**Gets delayed orders for requested work centers, in the selected time period */
export const getDelayedOrders = createAsyncThunk(
  STATISTICS_DELAYED_ORDERS_API,
  async (queries: StatisticsFormData, { rejectWithValue }) => {
    try {
      const response = await ApiService.post<DelayedOrder[]>(STATISTICS_DELAYED_ORDERS_API, queries);
      const { data } = response;
      debugger;
      return data;
    } catch (err: any) {
      return rejectWithValue(err.response ? err.response.status : err.message);
    }
  },
);
