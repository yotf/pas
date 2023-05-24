/**
 * @module WorkCenterPage
 */

import { useTranslate } from '@/modules/shared/hooks/translate.hook';
import { useExportToExcel } from '@/modules/shared/hooks/useExportToExcel';
import { exportToExcelFile, getDataForExcel } from '@/modules/shared/utils/exportToExcel.utils';
import { CombinedState } from '@reduxjs/toolkit';
import { FC, useCallback, useMemo } from 'react';
import { StoreType } from '../../../../store';
import { ExportToExcelProvider } from '../../components/maintain/contexts/exportToExcel.context';
import PageTable from '../../components/table/page-table.component';
import { WorkCenter, WorkCenterMapped } from '../settings/redux/workCenters/interfaces';
import { filterWorkCenters } from '../settings/redux/workCenters/slice';
import { deleteWorkCenterThunk, getAllWorkCenters } from '../settings/redux/workCenters/thunks';
/**
 * Defines columns order, mapper, getName and stateSelector consts which are passed down to the {@link PageTable} component that handles the rendering.
 * The table is wrapped with {@link ExportToExcelContext.ExportToExcelProvider} which allows the exportToExcel function to create excel reports from values returned by {@link useExportToExcel} hook.
 * @returns A {@link PageTable} component wrapped in {@link ExportToExcelContext.ExportToExcelProvider}.
 */
const WorkCenterTable: FC = () => {
  const columnsOrder: (keyof WorkCenterMapped)[] = useMemo(
    () => [
      'workCenter_Id',
      'name',
      'departmentName',
      'unitOfMeasureName',
      'allocationBasedName',
      'isActive',
    ],
    [],
  );
  const mapper = useCallback(
    (obj: WorkCenter): WorkCenterMapped => ({
      id: obj.id,
      name: obj.name,
      departmentName: obj.department.name,
      unitOfMeasureName: obj.unitOfMeasure?.name,
      allocationBasedName: obj.allocation?.name,
      isActive: obj.isActive,
      workCenter_Id: obj.workCenter_Id,
    }),
    [],
  );
  const getName = useCallback((obj: WorkCenterMapped) => obj.name, []);
  const stateSelector = useCallback((state: CombinedState<StoreType>) => state.workCenter, []);

  const { translate } = useTranslate({ ns: 'workCenters' });
  const { contextValue, uiData, sort } = useExportToExcel<WorkCenterMapped>();

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
      <div className={'workcenter-table'}>
        <PageTable
          ns={'workCenters'}
          columnsOrder={columnsOrder}
          readThunk={getAllWorkCenters}
          filterThunk={filterWorkCenters}
          deleteThunk={deleteWorkCenterThunk}
          stateSelector={stateSelector}
          mapEntityToUiData={mapper}
          getName={getName}
          exportToExcel={exportToExcel}
        />
      </div>
    </ExportToExcelProvider>
  );
};

export default WorkCenterTable;
