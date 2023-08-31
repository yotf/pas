/**
 * @module useRoutesTable
 */

import { useContext, ReactNode, useMemo } from 'react';
import { useFormContext } from 'react-hook-form';
import { useTable } from '../../../../shared/hooks/table/table.hook';
import { useTranslate } from '../../../../shared/hooks/translate.hook';
import { dateFormatter, nameofFactory } from '../../../../shared/utils/utils';
import { MaintainContext } from '../../../components/maintain/contexts/maintain.context';
import { RoutingFormData, RoutingRouteFormData } from '../../settings/redux/routings/interfaces';
import { POFormStatus, PORoutingOperationStatus } from '@/modules/shared/consts';

export type Props = {
  onEdit: (entity: RoutingRouteFormData) => void;
  onDelete: (entity: RoutingRouteFormData) => void;
  useActions?: boolean;
  isPlannedPO?: boolean;
};
/**
 *
 * @param onEdit Created in {@link RoutesTable} component. Defines what happens when user tries to edit a route (a table row).
 * @param onDelete Created in {@link RoutesTable} component. Defines what happens when user tries to delete a route (a table row).
 * @returns A table component created by {@link TableHook } hook from routing operations. The routing operation are extracted from the main form.
 */
export const useRoutesTable = ({
  onDelete,
  onEdit,
  useActions,
  isPlannedPO,
}: Props): JSX.Element => {
  const { ns } = useContext(MaintainContext);
  const { watch } = useFormContext<RoutingFormData>();
  const { routingAddAndUpdateOperations: routingOperations } = watch();
  const memoOperations = useMemo(
    () => routingOperations ?? [],
    [JSON.stringify(routingOperations)],
  );
  const { translate } = useTranslate({ ns, keyPrefix: 'routes' });
  const nameof = nameofFactory<RoutingRouteFormData>();
  const columns: (keyof RoutingRouteFormData)[] = [
    'sequence',
    'operationId',
    'operationName',
    'standardTime',
    'setupTime',
    'waitingTime',
    'leadTime',
    'departmentName',
    // 'planning',
  ];
  ns === 'productionOrder' ? columns.push('planningDate') : null;
  ns === 'productionOrder' ? columns.push('pO_OperationStatusEnum') : null;
  ns === 'productionOrder' ? columns.push('executedDate') : null;
  ns === 'productionOrder' ? columns.push('skipped') : null;
  const customColumns: Partial<Record<keyof RoutingRouteFormData, (value: any) => ReactNode>> = {
    planning: (value) => <span>{value ? translate('yes') : translate('no')}</span>,
    planningDate: (value) => dateFormatter(value),
    pO_OperationStatusEnum: (value) => translate(PORoutingOperationStatus[value]),
    executedDate: (value) => dateFormatter(value),
    skipped: (value) => <span>{value ? translate('yes') : translate('no')}</span>,
  };
  const table = useTable({
    dataSource: memoOperations,
    translateHeader: translate,
    columnsOrder: columns,
    customColumns: customColumns,
    onEdit,
    onDelete,
    usePaging: false,
    height: 250,
    rowKey: nameof('guid'),
    useActions,
    isPlannedPO,
  });
  return table;
};
