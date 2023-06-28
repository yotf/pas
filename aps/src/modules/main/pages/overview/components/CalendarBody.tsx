/**
 * @module CalendarBody
 */

import dayjs from 'dayjs';
import { FC } from 'react';
import {
  OverviewPORoutingOperationAddAndUpdate,
  PORoutingOperations,
} from '../../settings/redux/productionOrders/interfaces';
import { TableCellData } from '../utils/interfaces';
import { v4 as uuid } from 'uuid';

export type CalendarBodyProps = {
  allProductionOrderOperations: OverviewPORoutingOperationAddAndUpdate[];
  weekWithWorkingDays: TableCellData[];
};
/**
 *
 * @param allProductionOrderOperations All Production order operation returned from {@link useCalendarOperations}. Contains info if the operations are delayed or not.
 * @param weekWithWorkingDays Active week with info about is it a working day or not
 * @returns Operations of the work center in the table
 */
export const CalendarBody: FC<CalendarBodyProps> = ({
  allProductionOrderOperations,
  weekWithWorkingDays,
}): JSX.Element => {
  debugger;
  const tableBody = (
    <tbody>
      {allProductionOrderOperations.map((poOperation) => {
        return (
          <tr key={uuid()}>
            {weekWithWorkingDays.map((day) => {
              return dayjs(poOperation.planningDate).isSame(day.date, 'day') ? (
                <td
                  className={`${dayjs(poOperation.executedDate).isAfter(dayjs())} ${
                    day.isWorkingDay
                  } ${poOperation.isDelayed}`}
                >
                  {poOperation.operationTime}
                </td>
              ) : (
                <td className={day.isWorkingDay}>{day.isWorkingDay ? 0 : '/'}</td>
              );
            })}
          </tr>
        );
      })}
    </tbody>
  );

  return tableBody;
};
