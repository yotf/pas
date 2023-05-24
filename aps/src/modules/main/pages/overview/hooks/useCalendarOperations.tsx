/**
 * @module useCalendarOperations
 */

import dayjs from 'dayjs';
import { ProductionCalendarDay } from '../../settings/redux/productionCalendarsWorkCapacities/interfaces';
import {
  PORoutingOperations,
  ProductionOrder,
} from '../../settings/redux/productionOrders/interfaces';
import { TableCellData } from '../utils/interfaces';

export type UseCalendarOperationsProps = {
  productionOrders: ProductionOrder[];
  allProductionCalendarDays: ProductionCalendarDay[];
  activeWeek: dayjs.Dayjs[];
};

export type UseCalendarOperationsReturn = {
  weekWithWorkingDayinfo: TableCellData[];
  allOperations: PORoutingOperations[];
};
/**
 *
 * @param activeWeek Current week shown in a {@link TableCalendar} component.
 * @param allProductionCalendarDays All days in production calendar for the work center shown in the {@link TableCalendar}
 * @param productionOrders Production orders for the work center shown in the table
 * @returns Compares the data and return if operations of a production order are delayed (operationsWithDelayInfo - retured as allOperations when joined in one big array).
 * Also returns if the days in the activeWeek are working days or not (weekWithWorkingDayInfo)
 */
export const useCalendarOperations = ({
  activeWeek,
  allProductionCalendarDays,
  productionOrders,
}: UseCalendarOperationsProps): UseCalendarOperationsReturn => {
  const operationsWithDelayInfo: ProductionOrder[] = productionOrders.map((po) => {
    const lastOperationDate = dayjs(
      po.pO_RoutingOperations[po.pO_RoutingOperations.length - 1].planningDate,
    );
    let backgroundColor = dayjs(po.salesOrderDto.salesOrderDelivery).isAfter(
      lastOperationDate,
      'day',
    )
      ? 'green-cell'
      : 'red-cell';

    if (dayjs(po.salesOrderDto.salesOrderDelivery).isSame(lastOperationDate, 'day'))
      backgroundColor = 'yellow-cell';
    const newPoOperations = po.pO_RoutingOperations.map((op) => ({
      ...op,
      isDelayed: backgroundColor,
    }));

    return { ...po, pO_RoutingOperations: newPoOperations };
  });

  const allOperations: PORoutingOperations[] = operationsWithDelayInfo
    .map((po) => [...po.pO_RoutingOperations])
    .flat();

  const weekWithWorkingDayinfo: TableCellData[] = activeWeek.map((wd) => {
    const dayOfWeek = allProductionCalendarDays.filter((pcd) => {
      return dayjs(pcd.weekDay).isSame(wd, 'day');
    });

    const styling = dayOfWeek.length && !dayOfWeek[0].isWorkingDay ? 'inactive' : '';

    return { date: wd, isWorkingDay: styling };
  });

  return { weekWithWorkingDayinfo, allOperations };
};
