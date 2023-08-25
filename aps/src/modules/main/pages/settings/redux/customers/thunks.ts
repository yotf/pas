/**@module CustomersThunks */
import ApiService from '@/modules/shared/services/api.service';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { BASE_CUSTOMERS_API } from '../../consts/apiUrl';
import { SettingsPageItem } from '../../consts/interfaces';
/** Gets all customers and stores them in redux. Places last added customer at the start of the array using lastAddedId*/
export const getAllCustomers = createAsyncThunk(
  BASE_CUSTOMERS_API,
  async (lastAddedId: number | undefined, { rejectWithValue }) => {
    try {
      const response = await ApiService.get<SettingsPageItem[]>(BASE_CUSTOMERS_API);
      const { data } = response;
      const index = lastAddedId ? data.findIndex(({ id }) => id === lastAddedId) : -1;
      if (index >= 0) {
        data.unshift(...data.splice(index, 1));
      }
      return data;
    } catch (err: any) {
      return rejectWithValue(err.response ? err.response.status : err.message);
    }
  },
);
/** Creates a new (id - 0) or edits an existing customer (id - any other value greater than 0 ). */
export const upsertCustomerThunk = createAsyncThunk(
  BASE_CUSTOMERS_API + '-upsert',
  async (payload: SettingsPageItem, { rejectWithValue, dispatch }) => {
    try {
      const response = payload.id
        ? await ApiService.put<SettingsPageItem>(BASE_CUSTOMERS_API, payload.id, payload)
        : await ApiService.post<SettingsPageItem>(BASE_CUSTOMERS_API, payload);
      dispatch(getAllCustomers(payload.id || response.data.id));
      return payload.id ? payload : response.data;
    } catch (err: any) {
      const errors: { description: string }[] = err?.response?.data ?? [];
      if (errors.length) {
        return rejectWithValue({ type: 'validationErrors', errors });
      }
      return rejectWithValue(err.response ? err.response.status : err.message);
    }
  },
);
/** Deletes Customer by its id
 */
export const deleteCustomersThunk = createAsyncThunk(
  BASE_CUSTOMERS_API + '-delete',
  async (payload: number, { rejectWithValue }) => {
    try {
      await ApiService.delete<SettingsPageItem>(BASE_CUSTOMERS_API, payload);
      return payload;
    } catch (err: any) {
      return rejectWithValue(err.response ? err.response : err.message);
    }
  },
);
