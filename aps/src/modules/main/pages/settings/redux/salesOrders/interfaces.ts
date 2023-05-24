/**@module SalesOrderInterfaces */
import { SettingsPageItem } from '../../consts/interfaces';
import { ChangeHistoryDto } from '../change-history.dto';
import type { Material } from '../materials/interfaces';
import { State } from '../slice';

export interface SalesOrder {
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

export interface SalesOrderFormData {
  id: number;
  orderNumber?: number;
  orderTypeId?: number;
  customerId?: number;
  customerOrderNumber: string;
  status?: number;
  remark: string;
  salesOrderMaterialsAddAndUpdate: SalesMaterialFormData[];
}

export interface SalesOrderMapped {
  id: number;
  orderNumber: number;
  orderTypeName: string;
  createdOn: string;
  customerName: string;
  customerOrderNumber: string;
  status: number;
}
/**
 * One material in {@link SalesOrderMaterialsTable}
 */
export interface SalesMaterial {
  id: number;
  salesOrderId: number;
  materialId: number;
  quantity1: number;
  quantity2: number;
  requestedDelivery: string;
  tanneryDelivery: string;
  material: Material;
  changeHistoryDto: ChangeHistoryDto;
}
/**
 * Used for editing a material in the table
 */
export interface SalesMaterialFormData {
  id: number;
  salesOrderId?: number;
  materialId?: number;
  quantity1?: number;
  quantity2?: number;
  requestedDelivery?: string;
  tanneryDelivery?: string;
  sequence?: number;
  materialName?: string;
  materialDescription?: string;
  unitOfMeasure1?: string;
  unitOfMeasure2?: string;
  guid?: string;
}

export type SalesOrderResponse = SalesOrder;

export type SalesOrdersResponse = State<SalesOrder, SalesOrderResponse>;
