/**
 * @module useExportToExcel
 */

import { ExportToExcelValue } from '@/modules/main/components/maintain/contexts/exportToExcel.context';
import { SorterResult } from 'antd/es/table/interface';
import { useMemo, useState } from 'react';

export type ExportToExcelReturn<T extends object> = ExportToExcelValue<T> & {
  contextValue: ExportToExcelValue<T>;
};
/**
 *
 * @returns Values used in {@link ExportToExcelContext} and functions used to export tables to excel
 * The uiData is set in {@link TableHook} hook.
 */
export const useExportToExcel = <T extends object>(): ExportToExcelReturn<T> => {
  const [sort, setSort] = useState<SorterResult<T>>();
  const [uiData, setUiData] = useState<T[]>([]);
  const contextValue = useMemo<ExportToExcelValue<T>>(
    () => ({
      uiData,
      setUiData,
      sort,
      setSort,
    }),
    [sort, uiData],
  );

  return {
    contextValue,
    uiData,
    setUiData,
    sort,
    setSort,
  };
};
