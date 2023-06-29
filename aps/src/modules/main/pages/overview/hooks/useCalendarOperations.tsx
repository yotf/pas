/**
 * @module useCalendarOperations
 */

import dayjs from 'dayjs';
import { ProductionCalendarDay } from '../../settings/redux/productionCalendarsWorkCapacities/interfaces';
import {
  OverviewPORoutingOperationAddAndUpdate,
  PORoutingOperations,
  ProductionOrder,
} from '../../settings/redux/productionOrders/interfaces';
import { TableCellData } from '../utils/interfaces';

export type UseCalendarOperationsProps = {
  //  productionOrders: ProductionOrder[];
  allProductionCalendarDays: ProductionCalendarDay[];
  activeWeek: dayjs.Dayjs[];
  pO_RoutingOperations: OverviewPORoutingOperationAddAndUpdate[];
};

export type UseCalendarOperationsReturn = {
  weekWithWorkingDayinfo: TableCellData[];
  operationsWithDelayInfo: OverviewPORoutingOperationAddAndUpdate[];
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
  pO_RoutingOperations,
}: UseCalendarOperationsProps): UseCalendarOperationsReturn => {
  const lastOperation = pO_RoutingOperations[pO_RoutingOperations.length - 1];
  const operationsWithDelayInfo: OverviewPORoutingOperationAddAndUpdate[] =
    pO_RoutingOperations.map((operation) => {
      const operationDate = dayjs(operation.foreseenDeliveryDate); // TODO foreseen delivery date?
      let backgroundColor = dayjs(
        operation.productionOrder.salesOrderDto.salesOrderDelivery,
      ).isAfter(operationDate, 'day')
        ? 'green-cell'
        : 'red-cell';

      if (
        dayjs(operation.productionOrder.salesOrderDto.salesOrderDelivery).isSame(
          operationDate,
          'day',
        )
      )
        backgroundColor = 'yellow-cell';
      return {
        ...operation,
        isDelayed: backgroundColor,
      };
    });

  // const allOperations: PORoutingOperations[] = operationsWithDelayInfo
  //   .map((po) => [...po.pO_RoutingOperations])
  //   .flat();

  const weekWithWorkingDayinfo: TableCellData[] = activeWeek.map((wd) => {
    const dayOfWeek = allProductionCalendarDays.filter((pcd) => {
      return dayjs(pcd.weekDay).isSame(wd, 'day');
    });

    const styling = dayOfWeek.length && !dayOfWeek[0].isWorkingDay ? 'inactive' : '';

    return { date: wd, isWorkingDay: styling };
  });

  return { weekWithWorkingDayinfo, operationsWithDelayInfo };
};
