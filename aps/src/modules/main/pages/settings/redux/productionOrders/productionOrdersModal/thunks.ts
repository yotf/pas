/**@module ProductionOrderModalThunks */
import ApiService from '@/modules/shared/services/api.service';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { BASE_PRODUCTION_ORDER_API } from '../../../consts/apiUrl';
import { ProductionOrderFormData } from '../interfaces';
/**Creates one production order for each object in the accepted array */
export const createProductionOrdersFromSalesOrder = createAsyncThunk(
  BASE_PRODUCTION_ORDER_API + 'fromSalesOrder',
  async (productionOrders: ProductionOrderFormData[], { rejectWithValue }) => {
    try {
      const response = await ApiService.post<ProductionOrderFormData[]>(
        BASE_PRODUCTION_ORDER_API,
        productionOrders,
      );
      const { data } = response;
      return data;
    } catch (err: any) {
      return rejectWithValue(err.response ? err.response.status : err.message);
    }
  },
);
