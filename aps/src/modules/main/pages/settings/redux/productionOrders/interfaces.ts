/** @module ProductionOrderIntefaces */
import { SettingsPageItem } from '../../consts/interfaces';
import { ChangeHistoryDto } from '../change-history.dto';
import { Material } from '../materials/interfaces';
import { Operation } from '../operations/interfaces';
import { Routing, RoutingRouteFormData } from '../routings/interfaces';
import { SalesMaterial, SalesOrder } from '../salesOrders/interfaces';
import { State } from '../slice';
import { WorkCenter } from '../workCenters/interfaces';

export interface PORoutingOperationAddAndUpdate {
  id: number;
  pO_OperationStatusEnum: number;
  workCenterId: number;
  operationId: number;
  planning: boolean;
  leadTime?: number;
  remark: string;
  standardTime?: number | string;
  setupTime?: number | string;
  waitingTime?: number | string;
  operationTime?: number | string;
  planningDate: string;
  executedDate: string;
  skipped: boolean;
}

export interface OverviewPORoutingOperationAddAndUpdate extends PORoutingOperationAddAndUpdate {
  productionOrder: ProductionOrder;
  operation: Operation;
  isDelayed?: string;
  foreseenDeliveryDate: string;
}

export interface ProductionOrderTypeDto {
  changeHistoryDto: ChangeHistoryDto;
  code: string;
  id: number;
  isActive: boolean;
  name: string;
}

export interface PORoutingOperations extends PORoutingOperationAddAndUpdate {
  workCenter: WorkCenter;
  workCenters: WorkCenter[];
  changeHistoryDto: ChangeHistoryDto;
  operation: Operation;

  sequence?: number;
}

export type AddAndUpdateSalesOrderMaterials = {
  id: number;
  materialId: number;
  quantity1: number;
  quantity2: number;
  requestedDelivery: string;
  tanneryDelivery: string;
};

export interface SalesOrderDto extends SalesOrder {
  SalesOrderMaterialsAddAndUpdate: AddAndUpdateSalesOrderMaterials[];
}

export interface SalesOrderMaterialDto extends SalesMaterial {
  materials: Material[];
}

export type StatusSituation = {
  id: number;
  name: string;
};
export interface ProductionOrder {
  routingDto: Routing;
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
  salesOrderDto: SalesOrderDto;
  salesOrderMaterialDto: SalesOrderMaterialDto;
  materialDto: Material;
  statusOfPlanning: StatusSituation;
  situation: StatusSituation;
  pO_RoutingOperations: PORoutingOperations[];
  productionOrderTypeDto: ProductionOrderTypeDto;
  remark: string;
  poPosition?: number;
}

export interface ProductionOrderMapped {
  id?: number | string;
  orderNumber: number;
  orderType: string;
  creationDate: string;
  status: string;
  customerName: string;
  salesOrderNumber: number | string;
  salesOrderType: string;
  materialName: string;
  articleName: string;
  colorName: string;
  quantity1: number;
  unitOfMeasure1: string;
  quantity2: number;
  unitOfMeasure2: string;
  quantity3: number;
  salesOrderDeliveryDate: string;
  initialPlanningDate: string;
  POFinalDeliveryDate: string;
  POPosition: string;
  deliveryOfPosition: string;
  originPO: number;
  situation: string;
  salesOrderSequence?: string;
}

export interface ProductionOrderFormData {
  id?: number;
  orderNumber?: number;
  statusOfPlanningEnum: number;
  situationEnum?: number;
  productionOrderTypeId?: number;
  customerId?: number;
  customerOrderNumber?: string;
  salesOrderId?: number;
  salesOrderSequence?: string;
  salesOrderMaterialId?: number;
  routingId?: number;
  creationDate?: string;
  initialDate?: string;
  salesOrderDelivery?: string | null;
  finalDelivery?: string;
  foreseenDelivery?: string;
  foreseenDeliveryPOOrigin?: string;
  materialId?: number;
  origin?: number;
  quantity1?: number;
  quantity2?: number;
  quantity3?: number;
  unitOfMeasure1Id?: number;
  unitOfMeasure2Id?: number;
  unitOfMeasure3Id?: number;
  remark?: string;
  pO_RoutingOperationAddAndUpdateDtos?: RoutingRouteFormData[];
  /**Used only for better form control */
  statusOfPlanningBoolean?: boolean;
  //presentational properties
  productionOrderNumber?: number;
  materialGroupId?: number;
  articleId?: number;
  colorId?: number;
  thicknessId?: number;
  selectionId?: number;
  /** Added so logic from {@link RoutesTable} can be reused on routes table in {@link ProductionOrderMaintain}  page*/
  routingAddAndUpdateOperations?: RoutingRouteFormData[];
}

export type ProductionOrderResponse = ProductionOrder;

export type ProductionOrdersResponse = State<ProductionOrder, ProductionOrderResponse>;
