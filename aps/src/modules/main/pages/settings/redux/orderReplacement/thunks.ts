/**
 * @module OrderReplacementThunks
 */
import { createAsyncThunk } from '@reduxjs/toolkit';
import {

  ORDER_REPLACEMENT_GENERATE,
  ORDER_REPLACEMENT_REPLACE_ORDERS,
  ORDER_REPLACEMENT_SALES_ORDER_BY_CUSTOMER_ID,
} from '../../consts/apiUrl';
import {
  OrderReplacementFormData,
  ProductionOrder,
  ProductionOrderReplacementResponse,
  ReplaceProductionOrdersRequest,
  SalesOrderTypes,
} from './interfaces';
import { IdType } from '../thunks';
import ApiService from '@/modules/shared/services/api.service';
import { SalesOrderResponse } from '../salesOrders/interfaces';
/**
 * Gets order replacement data for in and out sales order tables
 */
export const getOrderReplacement = createAsyncThunk(
  ORDER_REPLACEMENT_GENERATE,
  async (form: OrderReplacementFormData, { rejectWithValue }) => {
    try {
      const response = await ApiService.post<ProductionOrderReplacementResponse>(
        ORDER_REPLACEMENT_GENERATE,
        form,
      );
      return response.data;
    } catch (err: any) {
      return rejectWithValue(err.response ? err.response: err.message);
    }
  },
);

export const getSalesOrderByCustomer = createAsyncThunk(
  ORDER_REPLACEMENT_SALES_ORDER_BY_CUSTOMER_ID,
  async (
    { id, salesOrderType }: { id: IdType; salesOrderType: SalesOrderTypes },
    { rejectWithValue },
  ) => {
    try {
      const response = await ApiService.get<SalesOrderResponse[]>(
        `${ORDER_REPLACEMENT_SALES_ORDER_BY_CUSTOMER_ID}/${id}`,
      );
      return { salesOrderType, data: response.data };
    } catch (err: any) {
      return rejectWithValue(err.response ? err.response.status : err.message);
    }
  },
);


