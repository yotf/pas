/**@module ReallocationOfPlanningInterfaces */
import { PORoutingOperations } from '../../productionOrders/interfaces';

export interface ReallocationOfPlanningForm {
  productionOrderNumber: number;
  productionOrderDelivery?: string;
  salesOrderDelivery?: string;
  reallocationOperations?: PORoutingOperations[];
  limitCapacity?: boolean;
}

export interface ReallocationOperationMapped {
  sequence: number;
  operationId?: number;
  workCenterId?: number;
  operationName: string;
  status?: number;
  operationTime?: number | string;
  setupTime?: number | string;
  leadTime?: number | string;
  planningDate: string;
  executedDate: string;
  pO_RoutingOperationId: number;
  skipped: boolean;
}
