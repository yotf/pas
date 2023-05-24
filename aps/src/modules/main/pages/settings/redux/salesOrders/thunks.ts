/**@module SalesOrderThunks */
import { BASE_SALES_ORDERS_API } from '../../consts/apiUrl';
import { createCrudThunks } from './../thunks';
import { SalesOrder, SalesOrderFormData, SalesOrderResponse } from './interfaces';
/**
 * Thunks created by {@link CrudThunks} function. Used for {@link SalesOrderSlice}
 */
export const salesOrderThunks = createCrudThunks<
  SalesOrder,
  SalesOrderResponse,
  SalesOrderFormData
>(BASE_SALES_ORDERS_API);
export const {
  listThunk: getAllSalesOrders,
  readThunk: getSalesOrder,
  upsertThunk: upsertSalesOrderThunk,
  deleteThunk: deleteSalesOrderThunk,
} = salesOrderThunks;
