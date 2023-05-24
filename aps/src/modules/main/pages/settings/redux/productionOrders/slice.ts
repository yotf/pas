/**@module ProductionOrderSlice */
import { createEntitySlice } from '../slice';
import { ProductionOrder, ProductionOrderResponse } from './interfaces';
import { productionOrderThunks } from './thunks';
/**
 * Slice created by {@link CrudSlice}
 */
const productionOrderSlice = createEntitySlice<
  ProductionOrder,
  ProductionOrderResponse,
  ProductionOrder
>(
  'productionOrderSlice',
  (entity) => [
    String(entity.salesOrderDto?.orderNumber),
    entity.salesOrderDto?.orderType?.name,
    entity.salesOrderDto?.customer?.name,
    entity.salesOrderDto?.customerOrderNumber,
    entity.salesOrderMaterialDto?.material.name,
    entity.materialDto?.name,
  ],
  productionOrderThunks,
);
export const {
  filterEntities: filterProductionOrders,
  clearEntity: clearProductionOrder,
  clearError: clearProductionOrderErrors,
} = productionOrderSlice.actions;
export const productionOrderReducer = productionOrderSlice.reducer;
