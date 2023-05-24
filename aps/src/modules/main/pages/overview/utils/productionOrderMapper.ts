/**
 * @module productionOrderMapper
 */

import { dateFormatter } from '@/modules/shared/utils/utils';
import { OverviewProductionOrderMapped } from '../../settings/redux/overview/interfaces';
import { ProductionOrder } from '../../settings/redux/productionOrders/interfaces';

export const productionOrderMapper = (
  productionOrder: ProductionOrder,
): OverviewProductionOrderMapped[] => {
  const productionOrderRepeatedProperties = {
    id: productionOrder?.id,
    orderNumber: productionOrder?.salesOrderDto.orderNumber,
    orderType: productionOrder?.salesOrderDto.orderType.name,
    customerName: productionOrder.salesOrderDto.customer.name,
    salesOrderNumber: productionOrder.salesOrderDto.orderNumber,
    materialName: productionOrder.salesOrderMaterialDto.material.name,
    articleName: productionOrder.salesOrderMaterialDto.material.article.name,
    colorName: productionOrder.salesOrderMaterialDto.material.color.name,
    foreseenDeliveryDate: dateFormatter(productionOrder.foreseenDelivery),
    quantity1: productionOrder.quantity1,
    unitOfMeasure1: productionOrder.salesOrderMaterialDto.material.unitOfMeasure1.name,
    salesOrderDeliveryDate: dateFormatter(productionOrder.foreseenDelivery),
  };

  const productionOrderOperations = productionOrder.pO_RoutingOperations.map((el, _, arr) => ({
    operationName: el.operation?.name,
    operationId: el.operationId,
    estimatedTime: productionOrder.quantity1 * Number(el.operationTime),
    setupTime: Number(el.setupTime) || 1,
    PODelivery: arr[arr.length - 1]?.executedDate
      ? ''
      : dateFormatter(arr[arr.length - 1].planningDate),
    POPosition: dateFormatter(arr.find((op) => op.executedDate === '')?.planningDate) ?? '',
    calendarName: 'Calendar',
  }));

  const mappedWorkCenters = productionOrderOperations.map((workCenterOperation) => ({
    ...productionOrderRepeatedProperties,
    ...workCenterOperation,
  }));
  return mappedWorkCenters;
};
