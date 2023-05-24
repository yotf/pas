/**
 * @module useDelayedOrdersTable
 */

import { useTable } from '@/modules/shared/hooks/table/table.hook';
import { useTranslate } from '@/modules/shared/hooks/translate.hook';
import { dateFormatter } from '@/modules/shared/utils/utils';
import { useAppSelector } from '@/store/hooks';
import { useCallback } from 'react';
import { DelayedOrder, DelayedOrderMapped } from '../../settings/redux/statistics/interfaces';

export const useDelayedOrders = (): JSX.Element => {
  const { delayedOrders } = useAppSelector((state) => state.statistics);

  const { translate } = useTranslate({ ns: 'statistics' });

  const mapper = useCallback(
    (obj: DelayedOrder): DelayedOrderMapped => ({
      sequence: obj.sequence,
      salesOrderNumber: obj.salesOrderNumber,
      customerName: obj.customer.name,
      materialName: obj.material.name,
      quantity: obj.quantity,
      foreseenDelivery: dateFormatter(obj.foreseenDelivery),
      salesOrderDelivery: dateFormatter(obj.salesOrderDelivery),
    }),
    [],
  );

  const delayedOrdersTable = useTable({
    rowKey: 'salesOrderNumber',
    dataSource: delayedOrders.map(mapper),
    translateHeader: translate,
    useActions: false,
    usePaging: false,
    height: 400,
  });

  return delayedOrdersTable;
};
