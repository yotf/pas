/**
 * @module OrderReplacementThunks
 */
import { createAsyncThunk } from '@reduxjs/toolkit';
import { BASE_ORDER_REPLACEMENT, BASE_ORDER_REPLACEMENT_RESPONSE } from '../../consts/apiUrl';
import { OrderReplacementFormData } from './interfaces';
import { mocked, mockedFormData } from './mocked';
/**
 * Gets order replacement data for in and out sales order tables
 */
export const getOrderReplacement = createAsyncThunk(
  BASE_ORDER_REPLACEMENT_RESPONSE,
  async (form: OrderReplacementFormData, { rejectWithValue }) => {
    try {
      //   const response = await ApiService.post<OrderReplacementResponse[]>(
      //     BASE_ORDER_REPLACEMENT_RESPONSE,
      //     form,
      //   );
      //   return response.data;
      return mocked.data;
    } catch (err: any) {
      return rejectWithValue(err.response ? err.response.status : err.message);
    }
  },
);
/**
 * Gets order replacement form data for dropdowns
 */
export const getSalesOrderReplacementForm = createAsyncThunk(
  BASE_ORDER_REPLACEMENT,
  async (_, { rejectWithValue }) => {
    try {
      // const response = await ApiService.get<SalesOrderReplacement[]>(BASE_ORDER_REPLACEMENT);
      // return response.data;
      return mockedFormData;
    } catch (err: any) {
      return rejectWithValue(err.response ? err.response.status : err.message);
    }
  },
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
