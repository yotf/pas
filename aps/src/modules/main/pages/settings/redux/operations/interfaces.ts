/**
 * @module OperationInterfaces
 */
import { SettingsPageItem } from '../../consts/interfaces';
import { State } from '../slice';
export interface Operation {
  id: number;
  name: string;
  operation_Id: number;
  departmentId: number;
  allocationBased: number;
  isActive: boolean;
  remark: string;
  unitOfMeasureId: number;
  operationTime: number;
  setupTime: number;
  waitingTime: number;
  department: SettingsPageItem;
  unitOfMeasure: SettingsPageItem;
  interfaceCode: string;
  departments: SettingsPageItem[];
  allocationBasedDtos: AllocationBased[];
  unitOfMeasures: SettingsPageItem[];
}

export interface OperationFormData {
  id?: number;
  name: string;
  operation_Id?: number;
  departmentId?: number;
  allocationBased?: number;
  isActive: boolean;
  remark: string;
  unitOfMeasureId?: number;
  operationTime?: number | string;
  setupTime?: number | string;
  waitingTime?: number | string;
  interfaceCode: string;
}
export interface OperationMapped {
  id: number;
  operation_Id: number;
  name: string;
  interfaceCode: string;
  departmentName?: string;
  operationTime: number;
  setupTime: number;
  isActive: boolean;
}

export interface AllocationBased {
  id: number;
  name: string;
}

export type OperationsResponse = State<Operation, OperationResponse>;

export type OperationResponse = Operation;
