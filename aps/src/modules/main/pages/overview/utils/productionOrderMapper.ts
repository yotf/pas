/**
 * @module productionOrderMapper
 */

import { dateFormatter } from '@/modules/shared/utils/utils';
import { OverviewProductionOrderOperationMapped } from '../../settings/redux/overview/interfaces';
import {
  OverviewPORoutingOperationAddAndUpdate,
  ProductionOrder,
} from '../../settings/redux/productionOrders/interfaces';

export const productionOrderMapper = (
  productionOrderOperation: OverviewPORoutingOperationAddAndUpdate,
): OverviewProductionOrderOperationMapped => {
  const productionOrder = productionOrderOperation.productionOrder;
  return {
    id: productionOrder?.id,
    orderNumber: productionOrder?.productionOrder_Id,
    orderType: productionOrder?.productionOrderTypeDto.name,
    customerName: productionOrder.customerDto.name,
    salesOrderNumber: productionOrder.salesOrderDto.orderNumber,
    materialName: productionOrder.materialDto.name,
    articleName: productionOrder.materialDto?.article?.name,
    colorName: productionOrder.materialDto?.color?.name,
    foreseenDeliveryDate: dateFormatter(productionOrder.foreseenDelivery),
    quantity1: productionOrder.quantity1,
    unitOfMeasure1: productionOrder?.unitOfMeasure1?.name,
    salesOrderDeliveryDate: dateFormatter(productionOrder.salesOrderDto.salesOrderDelivery),
    operationName: productionOrderOperation.operation.name,
    operationId: productionOrderOperation.operation.operation_Id,
    estimatedTime: productionOrder.quantity1 * Number(productionOrderOperation.standardTime),
    setupTime: Number(productionOrderOperation.setupTime) || 1,
    PODelivery: dateFormatter(productionOrderOperation.foreseenDeliveryDate),
    POPosition: productionOrder.poPosition?.toString() || '', // poPos?.toString() || '',
    operationTime: productionOrderOperation.operationTime,
    calendarName: 'Calendar',
    planningDate: productionOrderOperation.planningDate,
    executedDate: productionOrderOperation?.executedDate,
  };

  // const productionOrderOperations = productionOrder.pO_RoutingOperations.map((el, _, arr) => ({
  //   operationName: el.operation?.name,
  //   operationId: el.operationId,
  //   estimatedTime: productionOrder.quantity1 * Number(el.operationTime),
  //   setupTime: Number(el.setupTime) || 1,
  //   PODelivery: arr[arr.length - 1]?.executedDate
  //     ? ''
  //     : dateFormatter(arr[arr.length - 1].planningDate),
  //   POPosition: dateFormatter(arr.find((op) => op.executedDate === '')?.planningDate) ?? '',
  //   calendarName: 'Calendar',
  // }));

  // const mappedWorkCenters = productionOrderOperations.map((workCenterOperation) => ({
  //   ...productionOrderRepeatedProperties,
  //   ...workCenterOperation,
  // }));
  // return mappedWorkCenters;
};
