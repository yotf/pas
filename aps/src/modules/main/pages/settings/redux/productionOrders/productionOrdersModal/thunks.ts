/**@module ProductionOrderModalThunks */
import ApiService from '@/modules/shared/services/api.service';
import { createAsyncThunk } from '@reduxjs/toolkit';
import {
  CreateProductionOrderFromSalesOrderFormData,
  ProductionOrderFormData,
  ProductionOrdersResponse,
} from '../interfaces';
import { PRODUCTION_ORDER_GENERATE_FROM_SALES_ORDER } from '../../../consts/apiUrl';
/**Creates one production order for each object in the accepted array */

export const createProductionOrdersFromSalesOrder = createAsyncThunk(
  PRODUCTION_ORDER_GENERATE_FROM_SALES_ORDER,
  async (productionOrders: CreateProductionOrderFromSalesOrderFormData[], { rejectWithValue }) => {
    try {
      const response = await ApiService.post<ProductionOrderFormData[]>(
        PRODUCTION_ORDER_GENERATE_FROM_SALES_ORDER,
        { productionOrders: productionOrders },
      );
      const { data } = response;
      return data;
    } catch (err: any) {
      return rejectWithValue(err.response ? err.response.status : err.message);
    }
  },
);
