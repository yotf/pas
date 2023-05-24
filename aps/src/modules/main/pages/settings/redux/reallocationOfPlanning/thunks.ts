/**@module ReallocationOfPlanningThunks */
import { createAsyncThunk } from '@reduxjs/toolkit';
import { BASE_REALLOCATION_API } from '../../consts/apiUrl';
import { getAllProductionOrders } from '../productionOrders/thunks';
import { ReallocationOfPlanningForm } from './interfaces';
/** Changes status of planning for production order operations sent in the payload*/
export const upsertReallocation = createAsyncThunk(
  BASE_REALLOCATION_API + '-upsert',
  async (payload: ReallocationOfPlanningForm, { rejectWithValue, dispatch }) => {
    try {
      // const response = await ApiService.post<ReallocationOfPlanningForm>(
      //   BASE_REALLOCATION_API,
      //   payload,
      // );
      dispatch(getAllProductionOrders());
      return '';
    } catch (err: any) {
      return rejectWithValue(err.response ? err.response.status : err.message);
    }
  },
);
