/**@module WorkCenterInterfaces */
import { SettingsPageItem } from '../../consts/interfaces';
import { AllowedOperation } from '../allowedOperations/interfaces';
import { Operation } from '../operations/interfaces';
import { State } from '../slice';
import { WorkCapacity } from '../workcenterCapacities/interfaces';

export interface WorkCenter {
  id: number;
  name: string;
  isActive: boolean;
  workCenter_Id: number;
  workCenterInterfaceId: string;
  remark: string;
  departmentId: number;
  allocationBased: number;
  unitOfMeasureId: number;
  department: SettingsPageItem;
  unitOfMeasure?: SettingsPageItem;
  workCapacities: WorkCapacity[];
  allowedOperations: AllowedOperation[];
  allocation: SettingsPageItem;
  operations: Operation[];
  departments: SettingsPageItem[];
  allocations: AllocationBased[];
  unitOfMeasures: SettingsPageItem[];
  workCenterAddAndUpdateDto?: WorkCapacity[];
  weightCapacity?: number;
  usedInPlanning?: boolean;
}

export interface WorkCenterFormData {
  id?: number;
  name: string;
  workCenterInterfaceId?: string;
  departmentId?: number;
  allocationBased?: number;
  isActive: boolean;
  remark: string;
  unitOfMeasureId?: number | null;
  workCenter_Id: number;
  workCapacities?: WorkCapacity[];
  allowedOperations?: AllowedOperation[];
  workCenterAddAndUpdateDto?: WorkCapacity[];
  weightCapacity?: number;
}
export interface WorkCenterMapped {
  id: number;
  name: string;
  departmentName?: string;
  unitOfMeasureName?: string;
  allocationBasedName?: string;
  isActive: boolean;
  workCenter_Id: number;
}

export interface AllocationBased {
  id: number;
  name: string;
}

export type WorkCentersResponse = State<WorkCenter, WorkCenterResponse>;

export type WorkCenterResponse = WorkCenter;
