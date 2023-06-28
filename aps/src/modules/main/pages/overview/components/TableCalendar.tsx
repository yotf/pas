/**
 * @module TableCalendar
 */

import dayjs, { Dayjs } from 'dayjs';
import { FC, useMemo, useState } from 'react';
import { OverviewWorkCenter } from '../../settings/redux/overview/interfaces';
import { useCalendarOperations } from '../hooks/useCalendarOperations';
import { CalendarBody } from './CalendarBody';
import { CalendarHeader } from './CalendarHeader';

export type TableCalendarType = {
  calendarData: OverviewWorkCenter | undefined;
};
/**
 *
 * @param calendarData Data for one table returned by {@link useMappedOverviews} hook
 * @returns Calendar component. Defines active week and passes it down to {@link useCalendarOperations} hook which returns more info about data shown.
 * The data is passed down to {@link CalendarBody} and {@link TableHeader} for rendering
 */
const TableCalendar: FC<TableCalendarType> = ({ calendarData }: TableCalendarType) => {
  const { pO_RoutingOperations, productionCalendars } = calendarData!;
  const [currentDay, setCurrentDay] = useState(dayjs().get('day'));
  const allProductionCalendarDays = Object.values(productionCalendars);

  const activeWeek = useMemo(() => {
    const monday = dayjs().subtract(currentDay - 1, 'days');
    const currentWeek: Dayjs[] = [];

    for (let i = 0; i < 7; i++) {
      currentWeek.splice(i, 0, monday.add(i, 'days'));
    }

    return currentWeek;
  }, [currentDay]);

  const { operationsWithDelayInfo, weekWithWorkingDayinfo } = useCalendarOperations({
    activeWeek,
    allProductionCalendarDays,
    pO_RoutingOperations,
  });

  return (
    <div className='calendar-wrapper'>
      <table>
        <CalendarHeader
          activeWeek={activeWeek}
          allProductionCalendarDays={allProductionCalendarDays}
          allProductionOrderOperations={operationsWithDelayInfo}
        />
        <CalendarBody
          allProductionOrderOperations={operationsWithDelayInfo}
          weekWithWorkingDays={weekWithWorkingDayinfo}
        />
      </table>
    </div>
  );
};

export default TableCalendar;
