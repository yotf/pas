/**
 * @module OperationsPage
 */

import { useTranslate } from '@/modules/shared/hooks/translate.hook';
import { useExportToExcel } from '@/modules/shared/hooks/useExportToExcel';
import { exportToExcelFile, getDataForExcel } from '@/modules/shared/utils/exportToExcel.utils';
import { CombinedState } from '@reduxjs/toolkit';
import { FC, useCallback, useMemo } from 'react';
import { StoreType } from '../../../../store';
import { ExportToExcelProvider } from '../../components/maintain/contexts/exportToExcel.context';
import PageTable from '../../components/table/page-table.component';
import { Operation, OperationMapped } from '../settings/redux/operations/interfaces';
import { filterOperations } from '../settings/redux/operations/slice';
import { deleteOperationThunk, getAllOperations } from '../settings/redux/operations/thunks';
import './tableStyles.scss';
/**
 * Defines columns order, mapper, getName and stateSelector consts which are passed down to the {@link PageTable} component that handles the rendering.
 * The table is wrapped with {@link ExportToExcelContext.ExportToExcelProvider} which allows the exportToExcel function to create excel reports from values returned by {@link useExportToExcel.useExportToExcel} hook.
 * @returns A {@link PageTable} component wrapped in {@link ExportToExcelContext.ExportToExcelProvider}.
 */
const OperationsTable: FC = () => {
  const columnsOrder: (keyof OperationMapped)[] = useMemo(
    () => [
      'operation_Id',
      'name',
      'interfaceCode',
      'departmentName',
      'operationTime',
      'setupTime',
      'isActive',
    ],
    [],
  );
  const mapper = useCallback(
    (obj: Operation): OperationMapped => ({
      id: obj.id,
      name: obj.name,
      isActive: obj.isActive,
      interfaceCode: obj.interfaceCode,
      operation_Id: obj.operation_Id,
      operationTime: obj.operationTime,
      setupTime: obj.setupTime,
      departmentName: obj.department?.name,
    }),
    [],
  );
  const getName = useCallback((obj: OperationMapped) => obj.name, []);
  const stateSelector = useCallback((state: CombinedState<StoreType>) => state.operation, []);

  const { translate } = useTranslate({ ns: 'operations' });

  const { contextValue, uiData, sort } = useExportToExcel<OperationMapped>();

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
      <div className={'operations-table'}>
        <PageTable
          ns='operations'
          columnsOrder={columnsOrder}
          readThunk={getAllOperations}
          filterThunk={filterOperations}
          deleteThunk={deleteOperationThunk}
          stateSelector={stateSelector}
          mapEntityToUiData={mapper}
          getName={getName}
          exportToExcel={exportToExcel}
          disableExportToExcelButton={!uiData?.length}
        />
      </div>
    </ExportToExcelProvider>
  );
};

export default OperationsTable;
