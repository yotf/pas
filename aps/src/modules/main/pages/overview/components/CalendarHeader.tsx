/**
 * @module TableHeader
 */

import dayjs from 'dayjs';
import { FC } from 'react';
import { v4 as uuid } from 'uuid';
import { ProductionCalendarDay } from '../../settings/redux/productionCalendarsWorkCapacities/interfaces';
import { PORoutingOperations } from '../../settings/redux/productionOrders/interfaces';

export type CalendarHeaderProps = {
  activeWeek: dayjs.Dayjs[];
  allProductionCalendarDays: ProductionCalendarDay[];
  allProductionOrderOperations: PORoutingOperations[];
};
/**
 *
 * @param activeWeek Currently active week defined in {@link TableCalendar} component
 * @param allProductionCalendarDays All days of all months in the production calendar for the work center shown in the table. Returned from {@link useCalendarOperations}.
 * Contains info about if the day is a working day or not.
 * @param allProductionOrderOperations All Production order operation returned from {@link useCalendarOperations}. Contains info if the operations are delayed or not.
 * @returns Header for the calendar of the work center in a table. Header days are styled based on info about available minutes from the Production calendar (all production calendar days)
 */
export const CalendarHeader: FC<CalendarHeaderProps> = ({
  activeWeek,
  allProductionCalendarDays,
  allProductionOrderOperations,
}): JSX.Element => {
  const currentWeekWithAvailableMinutes = activeWeek.map((wd) => {
    const dayOfWeek = allProductionCalendarDays.filter((pcd) => {
      return dayjs(pcd.weekDay).isSame(wd, 'day');
    });

    const totalAllocatedTime = allProductionOrderOperations
      .filter((op) => {
        return dayjs(op.planningDate).isSame(wd, 'day');
      })
      .reduce((prev, next) => {
        return prev + Number(next.operationTime);
      }, 0);

    const availableMinutes = dayOfWeek.length ? dayOfWeek[0].availableMinutes : 0;

    const isCenterTooBusy = totalAllocatedTime > availableMinutes ? 'red-text' : 'blue-text';

    const isWorkingDay = dayOfWeek.length && !dayOfWeek[0].isWorkingDay ? 'inactive' : '';

    return {
      date: wd,
      availableMinutes: availableMinutes,
      isOverbooked: totalAllocatedTime === availableMinutes ? '' : isCenterTooBusy,
      isWorkingDay: isWorkingDay,
    };
  });

  const tableHeader = (
    <thead>
      {currentWeekWithAvailableMinutes.map((day) => (
        <th key={uuid()} className={day.isWorkingDay}>
          <span>{day.date.format('DD/MM').replace('/', '.')}</span>
          <br />
          <span className={day.isOverbooked}>{day.availableMinutes}</span>
        </th>
      ))}
    </thead>
  );

  return tableHeader;
};
