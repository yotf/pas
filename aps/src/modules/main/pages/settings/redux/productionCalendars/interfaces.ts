/**
 * @module ProductionCalendarInterfaces
 */

import { SettingsPageItem } from '../../consts/interfaces';
import { ChangeHistoryDto } from '../change-history.dto';
import { State } from '../slice';
import { WorkCenter } from '../workCenters/interfaces';

export interface ProductionCalendar {
  id: number;
  initialDate: string;
  finalDate: string;
  workCenters: WorkCenter[];
  changeHistoryDto: ChangeHistoryDto;
}

export interface ProductionCalendarMapped {
  id?: number;
  workCenterName: string;
  initialDate: string;
  finalDate: string;
}

export interface ProductionCalendarFormData {
  remark: string;
  id: number;
  weekDay: string;
  dayOfWeek: number;
  start: string;
  break: number;
  end: string;
  minutes: number;
  efficiency: number;
  availableMinutes: number;
  capacity: number;
  isWorkingDay: boolean;
}

export interface GenerateProductionCalendarFormData {
  workCenterIds: number[];
  initialDate: string;
  finalDate: string;
  holidays: SettingsPageItem[];
}

export type ProductionCalendarResponse = ProductionCalendar;

export type ProductionCalendarsResponse = State<ProductionCalendar, ProductionCalendarResponse>;
