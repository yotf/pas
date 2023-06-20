/**
 * @module SalesOrdersPage
 */

import { Status } from '@/modules/shared/consts';
import { useTranslate } from '@/modules/shared/hooks/translate.hook';
import { useExportToExcel } from '@/modules/shared/hooks/useExportToExcel';
import { exportToExcelFile, getDataForExcel } from '@/modules/shared/utils/exportToExcel.utils';
import { CombinedState } from '@reduxjs/toolkit';
import { FC, ReactNode, useCallback, useMemo } from 'react';
import { StoreType } from '../../../../store';
import { dateFormatter } from '../../../shared/utils/utils';
import { ExportToExcelProvider } from '../../components/maintain/contexts/exportToExcel.context';
import PageTable from '../../components/table/page-table.component';
import { SalesOrder, SalesOrderMapped } from '../settings/redux/salesOrders/interfaces';
import { filterSalesOrder } from '../settings/redux/salesOrders/slice';
import { deleteSalesOrderThunk, getAllSalesOrders } from '../settings/redux/salesOrders/thunks';
/**
 * Defines columns order, mapper, getName and stateSelector consts which are passed down to the {@link PageTable} component that handles the rendering.
 * The table is wrapped with {@link ExportToExcelContext.ExportToExcelProvider} which allows the exportToExcel function to create excel reports from values returned by {@link useExportToExcel} hook.
 * @returns A {@link PageTable} component wrapped in {@link ExportToExcelContext.ExportToExcelProvider}.
 */
const SalesOrdersTable: FC = () => {
  const ns = 'salesOrder';
  const columnsOrder: (keyof SalesOrderMapped)[] = useMemo(
    () => [
      'orderNumber',
      'orderTypeName',
      'createdOn',
      'customerName',
      'customerOrderNumber',
      'status',
    ],
    [],
  );
  const mapper = useCallback(
    (obj: SalesOrder): SalesOrderMapped => ({
      id: obj.id,
      orderNumber: obj.orderNumber,
      orderTypeName: obj.orderType?.name,
      customerName: obj.customer?.name,
      customerOrderNumber: obj.customerOrderNumber,
      status: obj.status,
      createdOn: dateFormatter(obj.changeHistoryDto?.createdOn),
    }),
    [],
  );

  const { translate } = useTranslate({ ns: ns });

  const getName = useCallback((obj: SalesOrderMapped) => String(obj.orderNumber), []);
  const stateSelector = useCallback((state: CombinedState<StoreType>) => state.salesOrders, []);
  const customColumns: Partial<Record<keyof SalesOrderMapped, (value: any) => ReactNode>> = {
    status: (value) => <span>{translate(Status[value])}</span>,
  };

  const { contextValue, uiData, sort } = useExportToExcel<SalesOrderMapped>();

  const exportToExcel = useCallback(() => {
    exportToExcelFile({
      filename: translate('title'),
      sheets: [
        {
          aoa_sheet_data: getDataForExcel(uiData, columnsOrder, translate, sort),
          sheetname: translate('title'),
        },
      ],
    });
  }, [columnsOrder, sort, translate, uiData]);

  return (
    <ExportToExcelProvider value={contextValue}>
      <PageTable
        ns={ns}
        columnsOrder={columnsOrder}
        readThunk={getAllSalesOrders}
        filterThunk={filterSalesOrder}
        deleteThunk={deleteSalesOrderThunk}
        stateSelector={stateSelector}
        mapEntityToUiData={mapper}
        getName={getName}
        customColumns={customColumns}
        exportToExcel={exportToExcel}
        disableExportToExcelButton={!uiData?.length}
      />
    </ExportToExcelProvider>
  );
};

export default SalesOrdersTable;
