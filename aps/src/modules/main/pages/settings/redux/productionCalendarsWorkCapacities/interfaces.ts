/**
 *@module ProductionCalendarWorkCapacitiesInterfaces
 */

import BaseResponse from '@/modules/shared/services/interfaces';
import { SettingsPageItem } from '../../consts/interfaces';
import { ChangeHistoryDto } from '../change-history.dto';
import { ProductionCalendarFormData } from '../productionCalendars/interfaces';
import { WorkCapacity } from '../workcenterCapacities/interfaces';
import { WorkCenter } from '../workCenters/interfaces';

export interface ProductionCalendarWorkCapacities {
  workCapacities: WorkCapacity[];
  holidays: SettingsPageItem[];
}

export interface ProductionCalendarWorkCapacitiesResponse extends BaseResponse {
  workCapacities: WorkCapacity[];
  holidays: SettingsPageItem[];
  productionCalendarIds: number[];
}

export interface ProductionCalendarBaseInfoDto extends ProductionCalendarFormData {
  changeHistoryDto: ChangeHistoryDto;
  initialDate: string;
  finalDate: string;
  workCenter: WorkCenter;
}

export interface ProductionCalendarDay {
  productionCalendarBaseInfoId: number;
  availableMinutes: number;
  break: number;
  capacity: number;
  changeHistoryDto: ChangeHistoryDto;
  dayOfWeek: number;
  efficiency: number;
  end: string;
  id: number;
  isWorkingDay: true;
  minutes: number;
  remark: string;
  start: string;
  weekDay: string;
  date?: string;
}

export interface ProductionCalendarDayMapped {
  id: number;
  date: string;
  start?: string;
  break?: number;
  end?: string;
  minutes?: number;
  efficiency?: number;
  availableMinutes?: number;
  remark: string;
  capacity?: number;
  dayOfWeek: number;
  isWorkingDay: boolean;
}

export type ProductionCalendarCheckingExportToExcelData = [string, ProductionCalendarDay[]];
/**
 * Months of a production calendar
 */
export interface ProductionCalendarTabs {
  [key: string]: ProductionCalendarDay[];
}

/**
 * Response when generating a production calendar
 */
export interface ProductionCalendarPostResponse {
  productionCalendarBaseInfoDto: ProductionCalendarBaseInfoDto;
  productionCalendars: ProductionCalendarTabs;
}
/**
 * Form data sent for getting work capacities of and holidays of a production calendar
 */
export type ProductionCalendarWorkCapacitiesQueries = {
  id: number;
  initialDate: string;
  finalDate: string;
};
