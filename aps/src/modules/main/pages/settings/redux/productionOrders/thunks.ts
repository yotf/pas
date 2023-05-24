/**@module ProductionOrderThunks */
import { BASE_PRODUCTION_ORDER_API } from '../../consts/apiUrl';
import { createCrudThunks } from '../thunks';
import { ProductionOrder, ProductionOrderResponse } from './interfaces';
/**
 * Thunks created by {@link CrudThunks} function. Used for {@link ProductionOrderSlice}
 */
export const productionOrderThunks = createCrudThunks<
  ProductionOrder,
  ProductionOrderResponse,
  ProductionOrder
>(BASE_PRODUCTION_ORDER_API, false, false, true);
export const {
  listThunk: getAllProductionOrders,
  readThunk: getProductionOrder,
  upsertThunk: upsertProductionOrder,
  deleteThunk: deleteProductionOrder,
} = productionOrderThunks;
