/**@module SalesOrderSlice */
import { createEntitySlice } from '../slice';
import { SalesOrder, SalesOrderFormData, SalesOrderResponse } from './interfaces';
import { salesOrderThunks } from './thunks';
/**
 * Slice created by {@link CrudSlice}
 */
const salesOrdersSlice = createEntitySlice<SalesOrder, SalesOrderResponse, SalesOrderFormData>(
  'salesOrdersSlice',
  (entity) => [
    String(entity?.orderNumber),
    String(entity?.orderType.name),
    String(entity?.customer.name),
    entity?.customerOrderNumber,
  ],
  salesOrderThunks,
);
export const { filterEntities: filterSalesOrder, clearEntity: clearSalesOrder } =
  salesOrdersSlice.actions;
export const salesOrdersReducer = salesOrdersSlice.reducer;
