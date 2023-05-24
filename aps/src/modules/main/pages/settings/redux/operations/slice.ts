/**
 * @module OperationSlice
 */
import { createEntitySlice } from '../slice';
import { Operation, OperationFormData, OperationResponse } from './interfaces';
import { operationThunks } from './thunks';
/**
 * Slice created by {@link CrudSlice}
 */
const operationsSlice = createEntitySlice<Operation, OperationResponse, OperationFormData>(
  'operationsSlice',
  (entity) => [entity.name, entity.department?.name, entity.interfaceCode],
  operationThunks,
);

export const { filterEntities: filterOperations, clearEntity: clearOperation } =
  operationsSlice.actions;
export const operationsReducer = operationsSlice.reducer;
