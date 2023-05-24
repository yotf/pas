/**@module ExportToExcelUtils */
import { IdentifiableEntity } from '@/modules/main/pages/settings/redux/thunks';
import { SorterResult } from 'antd/es/table/interface';
import dayjs from 'dayjs';
import * as XLSX from 'xlsx';
import { sorter } from '@/modules/shared/hooks/table/table.sorter';
import { dateFormatter } from './utils';

export type AnyType = string | number | boolean;

export interface Sheet {
  sheetname?: string;
  aoa_sheet_data: AnyType[][];
}

export interface ExportToExcel {
  /** Name of excel file */
  filename: string;
  /** List of sheets to be created inside the file */
  sheets: Sheet[];
}

const getSortedData = <T extends IdentifiableEntity>(uiData: T[], sort?: SorterResult<T>): T[] => {
  let sortedData = uiData;
  if (sort) {
    const sortField = sort.field as string;
    switch (sort.order) {
      case 'ascend':
        sortedData = uiData.sort((a: any, b: any) => sorter(a[sortField], b[sortField]));
        break;
      case 'descend':
        sortedData = uiData.sort((a: any, b: any) => sorter(b[sortField], a[sortField]));
        break;
    }
  }
  return sortedData;
};

const setColumnWidth = (aoa_sheet_data: AnyType[][]): XLSX.ColInfo[] => {
  const columns: XLSX.ColInfo[] = [];
  const numberOfElements = aoa_sheet_data[0].length;
  for (let i = 0; i < numberOfElements; i++) {
    const allElements = aoa_sheet_data.map((x) => x[i]).filter((el) => !!el);
    const maxTextLength = Math.max(...allElements.map((el) => el.toString().length));
    columns.push({ wch: maxTextLength + 2 });
  }
  return columns;
};

export const getDataForExcel = <T extends IdentifiableEntity>(
  uiData: T[],
  columnsOrder: (keyof T)[],
  translate: (value: string, options?: Record<string, string> | undefined) => string,
  sort?: SorterResult<T>,
): AnyType[][] => {
  const arr: AnyType[][] = [];
  const columns = columnsOrder.filter((x) => x !== 'id');
  const header = columns.map((item) => translate(item as string));
  arr.push(header);
  const sortedData = getSortedData<T>(uiData, sort);
  for (const element of sortedData) {
    const tempArray = columns.reduce<AnyType[]>((previousValue, currentValue) => {
      let result: AnyType = element[currentValue] as AnyType;
      if (currentValue === 'isActive') {
        result = translate(result ? 'active' : 'inactive');
      }
      if (currentValue === 'date') {
        result = dateFormatter(result as string);
      }
      return [...previousValue, result];
    }, []);
    arr.push(tempArray);
  }
  return arr;
};
/**
 *
 * @param obj Contains file name and list of sheets to be exported inside the excel file
 * @returns An excel file with specified name, calculated width of columns and multiple sheets
 */
export const exportToExcelFile = (obj: ExportToExcel): void => {
  const specificFormat = dayjs(dayjs()).format('YYYY_MM_DD');
  const wb = XLSX.utils.book_new();
  for (const sheet of obj.sheets) {
    if (sheet.aoa_sheet_data.length) {
      const ws = XLSX.utils.aoa_to_sheet(sheet.aoa_sheet_data);
      ws['!cols'] = setColumnWidth(sheet.aoa_sheet_data);
      XLSX.utils.book_append_sheet(wb, ws, sheet.sheetname || specificFormat);
    }
  }
  XLSX.writeFile(wb, `${obj.filename}-${specificFormat}.xlsx`);
};
