/**
 * @module ExportToExcelContext
 */

import { SorterResult } from 'antd/es/table/interface';
import { createContext, Dispatch, PropsWithChildren, SetStateAction } from 'react';

/**
 * Value returned from export to excel context.
 * @template T - T object used in exportable tables
 */
export type ExportToExcelValue<T extends object> = {
  /**
   * Data to be exported
   */
  uiData: T[];
  /**
   * Sets the uiData state
   */
  setUiData: Dispatch<SetStateAction<T[]>>;
  /**
   * Info about how uiData is sorted (asc, desc or undefined)
   */
  sort: SorterResult<T> | undefined;
  /**
   * Sets the sort state
   */
  setSort: Dispatch<SetStateAction<SorterResult<T> | undefined>>;
};
/**
 * Creates an export to excel context and initializes its values. The context wraps tables with export to excel functionality and provides data to the XLSX library.
 */
export const ExportToExcelContext = createContext<ExportToExcelValue<any>>({
  uiData: [],
  sort: {} as SorterResult<any>,
  setSort: () => {},
  setUiData: () => {},
});
/**
 * @template T - array of objects used in exportable tables
 */
export type ProviderProps<T extends object> = PropsWithChildren & {
  value: ExportToExcelValue<T>;
};
/**
 *
 * @param value {@link ExportToExcelValue}
 * @returns Export to Excel Context provider
 */
export const ExportToExcelProvider = <T extends object>({
  value,
  children,
}: ProviderProps<T>): JSX.Element => {
  return <ExportToExcelContext.Provider value={value}>{children}</ExportToExcelContext.Provider>;
};
