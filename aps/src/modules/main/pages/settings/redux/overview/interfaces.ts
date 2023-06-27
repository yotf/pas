/**
 * @module OverviewInterfaces
 */

import BaseResponse from '@/modules/shared/services/interfaces';
import { ProductionCalendarPostResponse } from '../productionCalendarsWorkCapacities/interfaces';
import { ProductionOrder } from '../productionOrders/interfaces';
import { WorkCenter } from '../workCenters/interfaces';

export interface WorkCenterExpanded extends WorkCenter {
  totalAllocatedTime?: number;
  totalAvailableTime?: number;
}
/** Represents one work center table shown in {@link OverviewPage} */
export interface OverviewWorkCenter {
  workCenter: WorkCenterExpanded;
  productionOrders: ProductionOrder[];
  productionCalendar: ProductionCalendarPostResponse;
}

export interface OverviewFormData {
  initialDate: string;
  finalDate: string;
  workCenters: number[];
  orderType: number;
  productionOrder: number;
}
/**
 * One table row shown in one overview work center table
 */
export interface OverviewProductionOrderMapped {
  id: number;
  orderNumber: number;
  orderType: string;
  customerName: string;
  salesOrderNumber: number;
  materialName: string;
  articleName: string;
  colorName: string;
  operationName: string;
  operationId: number;
  foreseenDeliveryDate: string;
  estimatedTime: number;
  setupTime: number;
  quantity1: number;
  unitOfMeasure1: string;
  salesOrderDeliveryDate: string;
  PODelivery: string;
  POPosition: string;
  calendarName: string;
  guid?: string;
}

export interface OverviewResponse extends BaseResponse {
  data: OverviewWorkCenter[];
}
