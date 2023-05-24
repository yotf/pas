/**
 * @module ColorsThunk
 */

import ApiService from '@/modules/shared/services/api.service';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { BASE_COLORS_API } from '../../consts/apiUrl';
import { SettingsPageItem } from '../../consts/interfaces';
/** Gets all colors and stores them in redux. Places last added color the start of the array */
export const getAllColors = createAsyncThunk(
  BASE_COLORS_API,
  async (lastAddedId: number | undefined, { rejectWithValue }) => {
    try {
      const response = await ApiService.get<SettingsPageItem[]>(BASE_COLORS_API);
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
/** Creates a new (id - 0) or edits an existing color (id - any other value greater than 0 ). */
export const upsertColorsThunk = createAsyncThunk(
  BASE_COLORS_API + '-upsert',
  async (payload: SettingsPageItem, { rejectWithValue, dispatch }) => {
    try {
      const response = payload.id
        ? await ApiService.put<SettingsPageItem>(BASE_COLORS_API, payload.id, payload)
        : await ApiService.post<SettingsPageItem>(BASE_COLORS_API, payload);
      dispatch(getAllColors(payload.id || response.data.id));
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
/** Deletes color by its id */
export const deleteColorsThunk = createAsyncThunk(
  BASE_COLORS_API + '-delete',
  async (payload: number, { rejectWithValue }) => {
    try {
      await ApiService.delete<SettingsPageItem>(BASE_COLORS_API, payload);
      return payload;
    } catch (err: any) {
      return rejectWithValue(err.response ? err.response.status : err.message);
    }
  },
);
