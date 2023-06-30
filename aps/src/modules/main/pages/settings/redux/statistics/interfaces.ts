/**@module StatisticsInterfaces */
import BaseResponse from '@/modules/shared/services/interfaces';
import { SettingsPageItem } from '../../consts/interfaces';
import { Material } from '../materials/interfaces';
/** Data sent to the api */
export interface StatisticsFormData {
  initialDate: string;
  finalDate: string;
  workCenters: number[];
}
/** One row presented in the statistics table */
export interface WorkCenterStatistics {
  workCenterId: number;
  workCenterName: string;
  availableMinutes: number;
  allocatedTime: number;
  setupTime: number;
  availability: number;
}
/** Response from the API */
export interface StatisticsGeneratedData {
  numberOfSalesOrders: number;
  delayedSalesOrders: number;
  numberOfPO: number;
  delayedPO: number;
  occupancy: number;
  allocatedMinutes: number;
  setupMinutes: number;
  availableMinutes: number;
  workCentersData: WorkCenterStatistics[];
}
/**Delayed order recieved from the API */
// export interface DelayedOrder {
// sequence: number;
// salesOrderNumber: number;
// customer: SettingsPageItem;
// material: Material;
// quantity: number;
// foreseenDelivery: string;
// salesOrderDelivery: string;
// }

export interface DelayedOrder {
  sequence: number;
  salesOrderNumber: number;
  customer: string;
  material: string;
  quantity: number;
  forseenDelivery: string;
  salesOrderDelivery: string;
}
/**Delayed order shown in the table delayed orders table */
export interface DelayedOrderMapped {
  sequence: number;
  salesOrderNumber: number;
  customerName: string;
  materialName: string;
  quantity: number;
  foreseenDelivery: string;
  salesOrderDelivery: string;
}

export interface StatisticsResponse extends BaseResponse {
  data: StatisticsGeneratedData;
  delayedOrders: DelayedOrder[];
}
