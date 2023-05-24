/**
 * @module ProductionOrderUtilityInterface
 */

import dayjs from 'dayjs';

export interface TableCellData {
  date: dayjs.Dayjs;
  isWorkingDay: string;
}
