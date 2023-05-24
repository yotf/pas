/**@module ProductionOrderModalInterfaces */
import { ProductionOrderFormData } from '../interfaces';
/**
 * Form used for collecting user inputs.
 */
export interface ProductionOrderModalForm {
  numberOfProductionOrders?: number;
  productionOrderTypeId?: number;
  routingId?: number;
  lotStandardQuantity?: number;
  /** Production orders to be created */
  productionOrders: ProductionOrderFormData[];
}
