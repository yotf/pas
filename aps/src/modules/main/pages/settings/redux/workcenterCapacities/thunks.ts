/**@module WorkCenterCapacitiesThunks */
import ApiService from '@/modules/shared/services/api.service';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { WORK_CENTER_GET_CAPACITIES_API } from '../../consts/apiUrl';
import { WorkCapacity } from './interfaces';
/**Gets all work center capacities for the selected work center id */
export const getAllWorkCapacitiesByWorkCenterId = createAsyncThunk(
  WORK_CENTER_GET_CAPACITIES_API,
  async (id: number | undefined, { rejectWithValue }) => {
    try {
      const response = await ApiService.get<WorkCapacity[]>(
        `${WORK_CENTER_GET_CAPACITIES_API}/${id}`,
      );
      const { data } = response;
      return data;
    } catch (err: any) {
      return rejectWithValue(err.response ? err.response.status : err.message);
    }
  },
);
