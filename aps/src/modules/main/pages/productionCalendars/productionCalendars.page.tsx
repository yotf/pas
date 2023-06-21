/**
 * @module ProductionCalendarsPage
 */

import { dateFormatter } from '@/modules/shared/utils/utils';
import { CombinedState } from '@reduxjs/toolkit';
import { FC, useCallback, useMemo } from 'react';
import { StoreType } from '../../../../store';
import PageTable from '../../components/table/page-table.component';
import {
  ProductionCalendar,
  ProductionCalendarMapped,
} from '../settings/redux/productionCalendars/interfaces';
import { filterProductionCalendars } from '../settings/redux/productionCalendars/slices';
import {
  deleteProductionCalendar,
  getAllProductionCalendars,
} from '../settings/redux/productionCalendars/thunks';
import { exportToExcelFile, getDataForExcel } from '@/modules/shared/utils/exportToExcel.utils';
import { useTranslate } from '@/modules/shared/hooks/translate.hook';
import { useExportToExcel } from '@/modules/shared/hooks/useExportToExcel';
import { ExportToExcelProvider } from '../../components/maintain/contexts/exportToExcel.context';
/**
 * Defines columns order, mapper, getName and stateSelector consts which are passed down to the {@link PageTable} component that handles the rendering.
 * The table is wrapped with {@link ExportToExcelContext.ExportToExcelProvider} which allows the exportToExcel function to create excel reports from values returned by {@link useExportToExcel} hook.
 * @returns A {@link PageTable} component wrapped in {@link ExportToExcelContext.ExportToExcelProvider }.
 */
const ProductionCalendarTable: FC = () => {
  const columnsOrder: (keyof ProductionCalendarMapped)[] = useMemo(
    () => ['workCenterName', 'initialDate', 'finalDate'],
    [],
  );

  const mapper = useCallback(
    (obj: ProductionCalendar): ProductionCalendarMapped => ({
      id: obj.id,
      workCenterName: obj.workCenter.name,
      initialDate: dateFormatter(obj.initialDate),
      finalDate: dateFormatter(obj.finalDate),
    }),
    [],
  );
  const getName = useCallback((obj: ProductionCalendarMapped) => obj.workCenterName, []);
  const stateSelector = useCallback(
    (state: CombinedState<StoreType>) => state.productionCalendars,
    [],
  );

  const { translate } = useTranslate({ ns: 'productionCalendar' });

  const { contextValue, uiData, sort } = useExportToExcel<ProductionCalendarMapped>();

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
        ns={'productionCalendar'}
        columnsOrder={columnsOrder}
        readThunk={getAllProductionCalendars}
        filterThunk={filterProductionCalendars}
        deleteThunk={deleteProductionCalendar}
        stateSelector={stateSelector}
        mapEntityToUiData={mapper}
        getName={getName}
        exportToExcel={exportToExcel}
        disableExportToExcelButton={!uiData?.length}
      />
    </ExportToExcelProvider>
  );
};

export default ProductionCalendarTable;
