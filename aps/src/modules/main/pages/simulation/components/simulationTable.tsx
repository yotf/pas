/**
 * @module SimulationTable
 */

import { useTable } from '@/modules/shared/hooks/table/table.hook';
import { useTranslate } from '@/modules/shared/hooks/translate.hook';
import { useAppSelector } from '@/store/hooks';
import { FC } from 'react';
import { useSimulationTableColumns } from '../hooks/useSimulationTableColumns';
/**
 *
 * @returns A table containing simulation data
 */
const SimulationTable: FC = (): JSX.Element => {
  const { translate } = useTranslate({ ns: 'simulation' });
  const { workCenterSimulation } = useAppSelector((state) => state.simulation);

  const columns = useSimulationTableColumns();

  const table = useTable({
    dataSource: workCenterSimulation,
    translateHeader: translate,
    useActions: false,
    usePaging: false,
    rowKey: 'workCenterId',
    columns,
  });

  return <div className='table-container'>{table}</div>;
};

export default SimulationTable;
