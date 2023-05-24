/** @module ProductionOrderStatusThunks */
import ApiService from '@/modules/shared/services/api.service';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { PRODUCTION_ORDER_STATUS_API } from '../../../consts/apiUrl';
import { getAllProductionOrders } from '../thunks';
import { StatusUpdateData } from './interfaces';
/**Changes status for production orders. Production orders to be changed and their new status value are inside the data parameter */
export const updateProductionOrderStatus = createAsyncThunk(
  PRODUCTION_ORDER_STATUS_API,
  async (data: StatusUpdateData, { rejectWithValue, dispatch }) => {
    try {
      const response = await ApiService.put<StatusUpdateData>(
        PRODUCTION_ORDER_STATUS_API,
        '',
        data,
      );
      dispatch(getAllProductionOrders());
      const { data: newData } = response;
      return newData;
    } catch (err: any) {
      return rejectWithValue(err.response ? err.response.status : err.message);
    }
  },
);
