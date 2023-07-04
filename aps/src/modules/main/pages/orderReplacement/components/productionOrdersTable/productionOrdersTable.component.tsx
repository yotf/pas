/**
 * @module ProductionOrdersTable
 */

import { createColumns } from '@/modules/shared/hooks/table/table.columns';
import { useTranslate } from '@/modules/shared/hooks/translate.hook';
import { dateFormatter } from '@/modules/shared/utils/utils';
import { useAppSelector } from '@/store/hooks';
import { Table } from 'antd';
import { FC, ReactNode, useCallback } from 'react';
import {
  ProductionOrder,
  ProductionOrderResponse,
} from '../../../settings/redux/orderReplacement/interfaces';
import './productionOrdersTable.component.scss';
import PageTable from '@/modules/main/components/table/page-table.component';

export interface ProductionOrdersTableProps {
  tableType: 'in' | 'out';
}

const columnsOrder: (keyof ProductionOrder)[] = [
  'productionOrderNumber',
  'materialName',
  'quantity1',
  'unitOfMeasure1',
  'quantity2',
  'unitOfMeasure2',
  'foreseenDelivery',
];
/**
 *
 * @param tableType Determines data sources and localizations used for the table
 * @returns Production Orders table used in {@link OrderReplacementPage}
 */
const ProductionOrdersTable: FC<ProductionOrdersTableProps> = ({ tableType }) => {
  // const customColumns: Partial<Record<keyof ProductionOrder, (value: any) => ReactNode>> = {
  //   foreseenDelivery: (value: string) => <span>{dateFormatter(value)}</span>,
  // };

  const { translate } = useTranslate({
    ns: 'orderReplacement',
    keyPrefix: 'table',
  });

  const { outProductionOrders, inProductionOrders } = useAppSelector(
    (state) => state.orderReplacement.data,
  );

  const mapper = useCallback(
    (obj: ProductionOrderResponse): ProductionOrder => ({
      sequence: 0,
      productionOrderNumber: obj.productionOrder_Id,
      materialName: obj.materialDto.name,
      quantity1: obj.quantity1,
      unitOfMeasure1: obj.unitOfMeasure1.name,
      quantity2: obj.quantity2,
      unitOfMeasure2: obj.unitOfMeasure2.name,
      foreseenDelivery: dateFormatter(obj.foreseenDelivery),
    }),
    [],
  );

  const columns = createColumns(
    inProductionOrders.map(mapper),
    translate,
    columnsOrder,
    undefined,
    true,
  );
  return (
    <div className='table-wrapper'>
      <h3>{translate(`${tableType}_production_orders_title`)}</h3>
      <div className='production-order-table'>
        <Table
          columns={columns}
          dataSource={
            tableType === 'in'
              ? (inProductionOrders.map(mapper) as ProductionOrder[])
              : (outProductionOrders.map(mapper) as ProductionOrder[])
          }
          rowKey={'id'}
          pagination={false}
          scroll={{ x: 'fit-content' }}
        />
      </div>
    </div>
  );
};

export default ProductionOrdersTable;
