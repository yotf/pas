/**
 * @module TableCalendar
 */

import dayjs, { Dayjs } from 'dayjs';
import { FC, useMemo, useState } from 'react';
import {
  OverviewProductionOrderOperationMapped,
  OverviewWorkCenter,
  WorkCenterExpanded,
} from '../../settings/redux/overview/interfaces';
import { useCalendarOperations } from '../hooks/useCalendarOperations';
import { CalendarBody } from './CalendarBody';
import { CalendarHeader } from './CalendarHeader';
import { ProductionCalendarPostResponse } from '../../settings/redux/productionCalendarsWorkCapacities/interfaces';
import { OverviewPORoutingOperationAddAndUpdate } from '../../settings/redux/productionOrders/interfaces';
import { useFormContext } from 'react-hook-form';
import { init } from 'i18next';

export type OverviewWorkCenterCalendar = {
  workCenter: WorkCenterExpanded;
  pO_RoutingOperations: OverviewPORoutingOperationAddAndUpdate[];
  // productionOrders: ProductionOrder[];
  productionCalendars: ProductionCalendarPostResponse;
};

export type TableCalendarType = {
  calendarData: OverviewWorkCenterCalendar | undefined;
};
/**
 *
 * @param calendarData Data for one table returned by {@link useMappedOverviews} hook
 * @returns Calendar component. Defines active week and passes it down to {@link useCalendarOperations} hook which returns more info about data shown.
 * The data is passed down to {@link CalendarBody} and {@link TableHeader} for rendering
 */
const TableCalendar: FC<TableCalendarType> = ({ calendarData }: TableCalendarType) => {
  const { pO_RoutingOperations, productionCalendars } = calendarData!;
  const { watch } = useFormContext();
  const { initialDate, finalDate } = watch();
  const [currentDay, setCurrentDay] = useState(dayjs(initialDate).get('day'));
  const allProductionCalendarDays = Object.values(productionCalendars);

 

  // const activeWeek = useMemo(() => {
  //   const monday = dayjs().subtract(currentDay - 1, 'days');
  //   const currentWeek: Dayjs[] = [];

  //   for (let i = 0; i < 7; i++) {
  //     currentWeek.splice(i, 0, monday.add(i, 'days'));
  //   }

  //   return currentWeek;
  // }, [currentDay]);

  const activeWeek = useMemo(() => {
    let dateArray = [];
    for (
      let date = dayjs(initialDate);
      date.isBefore(finalDate) || date.isSame(finalDate);
      date = date.add(1, 'day')
    ) {
      dateArray.push(date);
    }
    return dateArray;
  }, [initialDate, finalDate]);

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
