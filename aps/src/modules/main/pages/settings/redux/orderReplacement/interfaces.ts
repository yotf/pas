/**
 * @module OrderReplacementInterfaces
 */

import BaseResponse from '@/modules/shared/services/interfaces';
import { SettingsPageItem } from '../../consts/interfaces';
import { ChangeHistoryDto } from '../change-history.dto';
import { SalesMaterial } from '../salesOrders/interfaces';
import { Material } from '../materials/interfaces';
import { PORoutingOperations, SalesOrderMaterialDto, StatusSituation, ProductionOrderTypeDto } from '../productionOrders/interfaces';

export type SalesOrderTypes = 'in' | 'out';

export interface OrderReplacementFormData {
  outCustomerId?: number;
  outSalesOrderNumberId?: number;
  inCustomerId?: number;
  inSalesOrderNumberId?: number;
}

export interface OrderReplacementResponse extends BaseResponse {
  data: {
    outProductionOrders: ProductionOrderResponse[];
    inProductionOrders: ProductionOrderResponse[];
    inSalesOrders: SalesOrdersResponse[];
    outSalesOrders: SalesOrdersResponse[];
  };
  form: SalesOrderReplacement[];
}


export interface ProductionOrderReplacementResponse {
  outProductionOrders: ProductionOrderResponse[];
  inProductionOrders: ProductionOrderResponse[];
}

export interface ReplaceProductionOrdersRequest {
  inProductionOrders: number[] | string[];
  outProductionOrders: number[] | string[];
}

export interface ProductionOrder {
  sequence: number;
  productionOrderNumber?: number;
  materialName?: string;
  quantity1?: number;
  unitOfMeasure1?: string;
  quantity2?: number;
  unitOfMeasure2?: string;
  foreseenDelivery?: string;
}

export interface ProductionOrderResponse {
  id: number;
  statusOfPlanningEnum: number;
  situationEnum: number;
  productionOrderTypeId: number;
  salesOrderId: number;
  salesOrderMaterialId: number;
  routingId: number;
  initialDate: string;
  finalDelivery: string;
  foreseenDeliveryPOOrigin: string;
  customerDto: SettingsPageItem;
  customerOrderNumber: string;
  foreseenDelivery: string;
  origin: number;
  factoryDetail: string;
  quantity1: number;
  quantity2: number;
  quantity3: number;
  unitOfMeasure1Id: number;
  unitOfMeasure2Id: number;
  unitOfMeasure3Id: number;
  unitOfMeasure1: SettingsPageItem;
  unitOfMeasure2: SettingsPageItem;
  unitOfMeasure3: SettingsPageItem;
  pO_RoutingOperationAddAndUpdateDtos: PORoutingOperations[];
  changeHistoryDto: ChangeHistoryDto;
  productionOrder_Id: number;
  salesOrderDto: SalesOrder;
  salesOrderMaterialDto: SalesOrderMaterialDto;
  materialDto: Material;
  statusOfPlanning: StatusSituation;
  situation: StatusSituation;
  pO_RoutingOperations: PORoutingOperations[];
  productionOrderTypeDto: ProductionOrderTypeDto;
}

export interface SalesOrder {
  id: number;
  orderNumber: string;
}

export interface SalesOrdersResponse {
  id: number;
  orderNumber: number;
  orderTypeId: number;
  customerId: number;
  customerOrderNumber: string;
  status: number;
  remark: string;
  orderTypes: SettingsPageItem[];
  orderType: SettingsPageItem;
  customers: SettingsPageItem[];
  customer: SettingsPageItem;
  statuses: SettingsPageItem[];
  statusInfo: SettingsPageItem;
  salesOrderMaterials?: SalesMaterial[];
  changeHistoryDto: ChangeHistoryDto;
  salesOrderDelivery: string;
  

}


export interface SalesOrderReplacement {
  id: number;
  name: string;
  salesOrders: SalesOrder[];
}
