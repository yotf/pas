/**
 * @module AllowedOperationsThunks
 */

import ApiService from '@/modules/shared/services/api.service';
import { createAsyncThunk } from '@reduxjs/toolkit';
import {
  WORK_CENTER_DELETE_ALLOWED_OPERATION,
  WORK_CENTER_GET_ACTIVE_OPERATIONS_BY_ALLOCATION_API,
  WORK_CENTER_GET_ALLOWED_OPERATIONS_BY_WORK_CENTER_API,
} from '../../consts/apiUrl';
import { Operation } from '../operations/interfaces';
import { AllowedOperation } from './interfaces';
/**
 * Gets all allowed operations for the selected work center by its id
 */
export const getAllAllowedOperationsByWorkCenterId = createAsyncThunk(
  WORK_CENTER_GET_ALLOWED_OPERATIONS_BY_WORK_CENTER_API,
  async (id: number | undefined, { rejectWithValue }) => {
    try {
      const response = await ApiService.get<AllowedOperation[]>(
        `${WORK_CENTER_GET_ALLOWED_OPERATIONS_BY_WORK_CENTER_API}/${id}`,
      );
      const { data } = response;
      return data;
    } catch (err: any) {
      return rejectWithValue(err.response ? err.response.status : err.message);
    }
  },
);
/** Gets all operations filtered by allocation */
export const getAllActiveOperationsByAllocationBased = createAsyncThunk(
  WORK_CENTER_GET_ACTIVE_OPERATIONS_BY_ALLOCATION_API,
  async (id: number | undefined, { rejectWithValue }) => {
    try {
      const response = await ApiService.get<Operation[]>(
        `${WORK_CENTER_GET_ACTIVE_OPERATIONS_BY_ALLOCATION_API}/${id}`,
      );
      const { data } = response;
      return data;
    } catch (err: any) {
      return rejectWithValue(err.response ? err.response.status : err.message);
    }
  },
);
/** Removes an operation from selected work center (id is operation id) */
export const deleteAllowedOperation = createAsyncThunk(
  WORK_CENTER_DELETE_ALLOWED_OPERATION,
  async (id: number, { rejectWithValue }) => {
    try {
      const response = await ApiService.delete<AllowedOperation>(
        WORK_CENTER_DELETE_ALLOWED_OPERATION,
        id,
      );
      const { data } = response;
      return data;
    } catch (err: any) {
      return rejectWithValue(err.response ? err.response.status : err.message);
    }
  },
);
