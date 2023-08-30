/**@module RoutingInterfaces */
import { SettingsPageItem } from '@/modules/main/pages/settings/consts/interfaces';
import { Operation } from '../operations/interfaces';
import { State } from '../slice';
import { ChangeHistoryDto } from './../change-history.dto';
import { Material } from './../materials/interfaces';
/** One routing contained on a routing */
export interface RoutingRoute {
  id?: number;
  routingId?: number;
  operationId?: number;
  planning: boolean;
  leadTime?: number;
  remark: string;
  standardTime?: number | string;
  setupTime?: number | string;
  waitingTime?: number | string;
  operationName?: string;
  departmentName?: string;
  changeHistoryDto: ChangeHistoryDto;
  operation: Operation;
  sequence: number;
}
/** Form data used for editing routing routes */
export interface RoutingRouteFormData {
  id?: number;
  operationId?: number;
  planning: boolean;
  leadTime?: number;
  remark: string;
  standardTime?: number | string;
  setupTime?: number | string;
  waitingTime?: number | string;
  operationName?: string;
  departmentName?: string;
  sequence?: number;
  guid?: string;
  skipped?: boolean;

  workCenterId?: number;
  planningDate?: string;
  executedDate?: string;
  operationTime?: number | string;
  pO_OperationStatusEnum?: number;
}

export interface Routing {
  id: number;
  routing_Id: number;
  name: string;
  isActive: boolean;

  routingInterfaceId: string;
  customerId: number;
  remark: string;
  lotStandardQuantity: number;
  interfaceCode: string;

  changeHistoryDto: ChangeHistoryDto;

  unitOfMeasure?: SettingsPageItem;
  material?: Material;
  customer?: SettingsPageItem;
  routingOperations?: RoutingRoute[];
}

export interface RoutingFormData {
  id?: number;
  name?: string;
  isActive?: boolean;
  routing_Id?: number;

  routingInterfaceId?: string;
  remark?: string;
  lotStandardQuantity?: number;

  customerId?: number;
  unitOfMeasureId?: number;
  materialId?: number;

  routingAddAndUpdateOperations?: RoutingRouteFormData[];
}

export interface RoutingMapped {
  id: number;
  name: string;
  isActive: boolean;
  routing_id: number;
  routingInterfaceId: string;
  createdOn: string;
  materialName: string;
  customerName: string;
  lotStandardQuantity: number;
}

export type RoutingResponse = Routing & {
  customers?: SettingsPageItem[];
  operations?: Operation[];
  unitOfMeasures?: SettingsPageItem[];
};

export type RoutingsResponse = State<Routing, RoutingResponse>;
