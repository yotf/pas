/**@module WorkCenterCapacitiesInterfaces */
import BaseResponse from '@/modules/shared/services/interfaces';
import { ChangeHistoryDto } from '../change-history.dto';
/** Entire work capacity recieved from the API */
export interface WorkCapacity {
  id: number;
  workCenterId: number;
  weekDay: string;
  dayOfWeek: number;
  start: string;
  break: number;
  end: string;
  minutes: number;
  efficiency: number;
  availableMinutes: number;
  isWorkingDay: boolean;
  capacity: number;
  changeHistoryDto: ChangeHistoryDto;
}
/** Work capacity with properties shown in the table */
export interface WorkCapacityMapped {
  id: number;
  dayOfWeek?: number;
  start?: string;
  break?: number;
  end?: string;
  minutes?: number;
  efficiency?: number;
  availableMinutes?: number;
  capacity?: number;
  guid?: string;
}

export interface WorkCapacitesResponse extends BaseResponse {
  data: WorkCapacity[];
}
