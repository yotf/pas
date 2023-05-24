/**
 * @module ProductionOrdersTable
 */

import { createColumns } from '@/modules/shared/hooks/table/table.columns';
import { useTranslate } from '@/modules/shared/hooks/translate.hook';
import { dateFormatter } from '@/modules/shared/utils/utils';
import { useAppSelector } from '@/store/hooks';
import { Table } from 'antd';
import { FC, ReactNode } from 'react';
import { ProductionOrder } from '../../../settings/redux/orderReplacement/interfaces';
import './productionOrdersTable.component.scss';

export interface ProductionOrdersTableProps {
  tableType: 'in' | 'out';
}

const columnOrder: (keyof ProductionOrder)[] = [
  'sequence',
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
  const customColumns: Partial<Record<keyof ProductionOrder, (value: any) => ReactNode>> = {
    foreseenDelivery: (value: string) => <span>{dateFormatter(value)}</span>,
  };

  const { translate } = useTranslate({
    ns: 'orderReplacement',
    keyPrefix: 'table',
  });

  const { outProductionOrders, inProductionOrders } = useAppSelector(
    (state) => state.orderReplacement.data,
  );

  const columns = createColumns(inProductionOrders, translate, columnOrder, customColumns, true);
  return (
    <div className='table-wrapper'>
      <h3>{translate(`${tableType}_production_orders_title`)}</h3>
      <div className='production-order-table'>
        <Table
          columns={columns}
          dataSource={tableType === 'in' ? inProductionOrders : outProductionOrders}
          rowKey={'id'}
          pagination={false}
          scroll={{ x: 'fit-content' }}
        />
      </div>
    </div>
  );
};

export default ProductionOrdersTable;
