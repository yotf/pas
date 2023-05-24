/**@module ProductionOrderTypesThunks */
import ApiService from '@/modules/shared/services/api.service';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { BASE_PRODUCTION_ORDER_TYPES_API } from '../../consts/apiUrl';
import { SettingsPageItem } from '../../consts/interfaces';
/** Gets all production order types and stores them in redux. Places last added production order type at the start of the array using lastAddedId*/
export const getAllProductionOrderTypes = createAsyncThunk(
  BASE_PRODUCTION_ORDER_TYPES_API,
  async (lastAddedId: number | undefined, { rejectWithValue }) => {
    try {
      const response = await ApiService.get<SettingsPageItem[]>(BASE_PRODUCTION_ORDER_TYPES_API);
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
/** Creates a new (id - 0) or edits an existing production order type (id - any other value greater than 0 ). */
export const upsertProductionOrderTypes = createAsyncThunk(
  BASE_PRODUCTION_ORDER_TYPES_API + '-upsert',
  async (payload: SettingsPageItem, { rejectWithValue, dispatch }) => {
    try {
      const response = payload.id
        ? await ApiService.put<SettingsPageItem>(
            BASE_PRODUCTION_ORDER_TYPES_API,
            payload.id,
            payload,
          )
        : await ApiService.post<SettingsPageItem>(BASE_PRODUCTION_ORDER_TYPES_API, payload);
      dispatch(getAllProductionOrderTypes(payload.id || response.data.id));
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
/** Deletes production order type by its id*/
export const deleteProductionOrderTypes = createAsyncThunk(
  BASE_PRODUCTION_ORDER_TYPES_API + '-delete',
  async (payload: number, { rejectWithValue, dispatch }) => {
    try {
      await ApiService.delete<SettingsPageItem>(BASE_PRODUCTION_ORDER_TYPES_API, payload);
      dispatch(getAllProductionOrderTypes());
      return payload;
    } catch (err: any) {
      const errors = err.response?.data;
      if (errors) {
        return rejectWithValue(errors);
      }
      return rejectWithValue(err.response ? err.response.status : err.message);
    }
  },
);
