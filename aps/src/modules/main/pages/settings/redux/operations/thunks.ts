/**
 * @module OperationThunk
 */
import { BASE_OPERATIONS_API } from '../../consts/apiUrl';
import { createCrudThunks } from './../thunks';
import { Operation, OperationFormData, OperationResponse } from './interfaces';
/**
 * Thunks created by {@link CrudThunks} function. Used for {@link MaterialSlice}
 */
export const operationThunks = createCrudThunks<Operation, OperationResponse, OperationFormData>(
  BASE_OPERATIONS_API,
);
export const {
  listThunk: getAllOperations,
  readThunk: getOperation,
  upsertThunk: upsertOperationThunk,
  deleteThunk: deleteOperationThunk,
} = operationThunks;
