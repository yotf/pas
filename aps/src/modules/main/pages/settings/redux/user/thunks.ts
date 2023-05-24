/**@module UserThunks */
import ApiService from '@/modules/shared/services/api.service';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { BASE_USER_API, ROLES_API } from '../../consts/apiUrl';
import { Role, User, UserFormData } from './interfaces';
/** Gets all units of measure and stores them in redux. */
export const getAllUsers = createAsyncThunk(BASE_USER_API, async (_, { rejectWithValue }) => {
  try {
    const response = await ApiService.get<User[]>(BASE_USER_API);
    return response.data;
  } catch (err: any) {
    return rejectWithValue(err.response ? err.response.status : err.message);
  }
});
/** Gets all roles and for roles dropdown */
export const rolesThunk = createAsyncThunk(
  ROLES_API,
  async (_: number | undefined, { rejectWithValue }) => {
    try {
      const response = await ApiService.get<Role[]>(ROLES_API);
      return response.data;
    } catch (err: any) {
      return rejectWithValue(err.response ? err.response.status : err.message);
    }
  },
);
/** Creates a new (id - 0) or edits an existing user (id - any other value greater than 0 ). */
export const upsertUserThunk = createAsyncThunk(
  BASE_USER_API + '-upsert',
  async (payload: UserFormData, { rejectWithValue, dispatch }) => {
    try {
      const response = payload.id
        ? await ApiService.put<UserFormData>(BASE_USER_API, payload.id, payload)
        : await ApiService.post<UserFormData>(BASE_USER_API, payload);
      dispatch(getAllUsers());
      return payload.id ? payload : response.data;
    } catch (err: any) {
      const errors: { description: string }[] = err?.response?.data?.errors ?? [];
      if (errors.length) {
        return rejectWithValue({ type: 'validationErrors', errors });
      }
      return rejectWithValue(err.response ? err.response.status : err.message);
    }
  },
);
/** Deletes user by its id*/
export const deleteUserThunk = createAsyncThunk(
  BASE_USER_API + '-delete',
  async (payload: string, { rejectWithValue }) => {
    try {
      await ApiService.delete<UserFormData>(BASE_USER_API, payload);
      return payload;
    } catch (err: any) {
      return rejectWithValue(err.response ? err.response.status : err.message);
    }
  },
);
