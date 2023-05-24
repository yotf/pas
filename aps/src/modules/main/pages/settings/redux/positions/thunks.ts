/**@module PositionsThunks */
import ApiService from '@/modules/shared/services/api.service';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { BASE_POSITIONS_API } from '../../consts/apiUrl';
import { SettingsPageItem } from '../../consts/interfaces';
/** Gets all positions and stores them in redux. Places last added position at the start of the array using lastAddedId*/
export const getAllPositions = createAsyncThunk(
  BASE_POSITIONS_API,
  async (lastAddedId: number | undefined, { rejectWithValue }) => {
    try {
      const response = await ApiService.get<SettingsPageItem[]>(BASE_POSITIONS_API);
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
/** Creates a new (id - 0) or edits an existing position (id - any other value greater than 0 ). */
export const upsertPositionThunk = createAsyncThunk(
  BASE_POSITIONS_API + '-upsert',
  async (payload: SettingsPageItem, { rejectWithValue, dispatch }) => {
    try {
      const response = payload.id
        ? await ApiService.put<SettingsPageItem>(BASE_POSITIONS_API, payload.id, payload)
        : await ApiService.post<SettingsPageItem>(BASE_POSITIONS_API, payload);
      dispatch(getAllPositions());
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
/** Deletes position by its id*/
export const deletePositionThunk = createAsyncThunk(
  BASE_POSITIONS_API + '-delete',
  async (payload: number, { rejectWithValue, dispatch }) => {
    try {
      await ApiService.delete<SettingsPageItem>(BASE_POSITIONS_API, payload);
      dispatch(getAllPositions());
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
