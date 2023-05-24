/**
 * @module ReallocationMappedData
 */

import { PORoutingOperations } from '../../../settings/redux/productionOrders/interfaces';
import { ReallocationOperationMapped } from '../../../settings/redux/reallocationOfPlanning/interfaces';
/**
 *
 * @param data Operations from selected Production Order
 * @returns Mapped operations from selected production order
 */
export const useReallocationMappedData = (
  data: PORoutingOperations[],
): ReallocationOperationMapped[] => {
  const mappedData = data.map(
    (operation: PORoutingOperations, i): ReallocationOperationMapped => ({
      sequence: operation.sequence || i + 1,
      operationId: operation.id,
      workCenterId: operation.workCenterId,
      executedDate: operation.executedDate,
      planningDate: operation.planningDate,
      leadTime: operation.leadTime,
      operationName: operation.operation?.name,
      operationTime: operation.standardTime,
      setupTime: operation.setupTime,
      status: operation.pO_OperationStatusEnum,
    }),
  );
  return mappedData;
};
