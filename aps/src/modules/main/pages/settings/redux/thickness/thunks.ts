/**@module ThicknessThunks */
import ApiService from '@/modules/shared/services/api.service';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { BASE_THICKNESS_API } from '../../consts/apiUrl';
import { SettingsPageItem } from '../../consts/interfaces';
/** Gets all thicknessess and stores them in redux. Places last added thickness at the start of the array using lastAddedId*/
export const getAllThickness = createAsyncThunk(
  BASE_THICKNESS_API,
  async (lastAddedId: number | undefined, { rejectWithValue }) => {
    try {
      const response = await ApiService.get<SettingsPageItem[]>(BASE_THICKNESS_API);
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
/** Creates a new (id - 0) or edits an existing thickness (id - any other value greater than 0 ). */
export const upsertThicknessThunk = createAsyncThunk(
  BASE_THICKNESS_API + '-upsert',
  async (payload: SettingsPageItem, { rejectWithValue, dispatch }) => {
    try {
      const response = payload.id
        ? await ApiService.put<SettingsPageItem>(BASE_THICKNESS_API, payload.id, payload)
        : await ApiService.post<SettingsPageItem>(BASE_THICKNESS_API, payload);
      dispatch(getAllThickness(payload.id || response.data.id));
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
/** Deletes thickness by its id*/
export const deleteThicknessThunk = createAsyncThunk(
  BASE_THICKNESS_API + '-delete',
  async (payload: number, { rejectWithValue, dispatch }) => {
    try {
      await ApiService.delete<SettingsPageItem>(BASE_THICKNESS_API, payload);
      dispatch(getAllThickness());
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
