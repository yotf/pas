/**
 * @module OrderReplacementThunks
 */
import { createAsyncThunk } from '@reduxjs/toolkit';
import { BASE_ORDER_REPLACEMENT, BASE_ORDER_REPLACEMENT_RESPONSE, ORDER_REPLACEMENT_GENERATE, ORDER_REPLACEMENT_SALES_ORDER_BY_CUSTOMER_ID } from '../../consts/apiUrl';
import { OrderReplacementFormData, ProductionOrder, ProductionOrderReplacementResponse, SalesOrderTypes } from './interfaces';
import { mocked, mockedFormData } from './mocked';
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
      const response = await ApiService.post<ProductionOrderReplacementResponse>(ORDER_REPLACEMENT_GENERATE, form);
      return response.data;
      //   const response = await ApiService.post<OrderReplacementResponse[]>(
      //     BASE_ORDER_REPLACEMENT_RESPONSE,
      //     form,
      //   );
      //   return response.data;
    } catch (err: any) {
      return rejectWithValue(err.response ? err.response.status : err.message);
    }
  },
);
/**
 * Gets order replacement form data for dropdowns
 */
// export const getSalesOrderReplacementForm = createAsyncThunk(
// BASE_ORDER_REPLACEMENT,
// async (_, { rejectWithValue }) => {
//   try {
//     // const response = await ApiService.get<SalesOrderReplacement[]>(BASE_ORDER_REPLACEMENT);
//     // return response.data;
//     return mockedFormData;
//   } catch (err: any) {
//     return rejectWithValue(err.response ? err.response.status : err.message);
//   }
// },
// );




export const getSalesOrderByCustomer = createAsyncThunk(
  ORDER_REPLACEMENT_SALES_ORDER_BY_CUSTOMER_ID,
  async ({ id, salesOrderType }:{ id: IdType, salesOrderType: SalesOrderTypes }, { rejectWithValue }) => {
    try {
      const response = await ApiService.get<SalesOrderResponse[]>(`${ORDER_REPLACEMENT_SALES_ORDER_BY_CUSTOMER_ID}/${id}`);
      return { salesOrderType, data: response.data };
    } catch (err: any) {
      return rejectWithValue(err.response ? err.response.status : err.message);
    }
  }
);

export const performOrderReplacement = createAsyncThunk(
  BASE_ORDER_REPLACEMENT + '-replace',
  async (orderReplacementInfo: OrderReplacementFormData, { rejectWithValue }) => {
    try {
      // const response = await ApiService.post<OrderReplacementFormData>(
      //   BASE_ORDER_REPLACEMENT,
      //   orderReplacementInfo,
      // );
      // return response.data;
      return '';
    } catch (err: any) {
      return rejectWithValue(err.response ? err.response.status : err.message);
    }
  },
);
