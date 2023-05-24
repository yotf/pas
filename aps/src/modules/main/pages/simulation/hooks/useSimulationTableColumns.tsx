/**
 * @module useSimulationTableColumns
 */

import { sorter } from '@/modules/shared/hooks/table/table.sorter';
import { useTranslate } from '@/modules/shared/hooks/translate.hook';
import { availabilityStyling } from '@/modules/shared/utils/utils';
import { ColumnsType, ColumnType } from 'antd/es/table';
import { ReactNode, useCallback, useMemo } from 'react';
import { SimulationWorkCenter } from '../../settings/redux/simulation/interfaces';

const columnKeys: (keyof SimulationWorkCenter)[][] = [
  ['workCenterId', 'workCenterName', 'totalAvailability'],
  ['allocatedTime', 'setupTime', 'availableTime'],
  ['simulatedAllocatedTime', 'simulatedSetupTime', 'simulatedAvailableTime'],
];

const titles: string[] = [' ', 'Real Data', 'Simulation Data'];

const getTimeElement = (value: number): ReactNode => (
  <span className={`availability ${availabilityStyling(value)}`}>
    {value < 0 ? `(${Math.abs(value)})` : value}
  </span>
);

const customColumns: Partial<Record<keyof SimulationWorkCenter, (value: any) => ReactNode>> = {
  availableTime: getTimeElement,
  simulatedAvailableTime: getTimeElement,
};
/**
 *
 * @returns Custom table columns for {@link SimulationTable} component. The columns are specific for an additional row of titles which follow table sections on resize
 */
export const useSimulationTableColumns = (): ColumnsType<SimulationWorkCenter> => {
  const { translate } = useTranslate({ ns: 'simulation' });

  const createColumnFromProp = useCallback(
    (key: keyof SimulationWorkCenter, index: number): ColumnType<SimulationWorkCenter> => ({
      title: () => translate(key.toString()),
      dataIndex: key.toString(),
      key: index,
      showSorterTooltip: false,
      sorter: (a, b): number => sorter(a[key], b[key]),
      render: customColumns[key],
    }),
    [translate],
  );
  const columns: ColumnsType<SimulationWorkCenter> = useMemo(
    () =>
      titles.map((title, key) => ({
        title: translate(title),
        key,
        showSorterTooltip: false,
        children: columnKeys[key].map(createColumnFromProp),
      })),
    [createColumnFromProp, translate],
  );

  return columns;
};
