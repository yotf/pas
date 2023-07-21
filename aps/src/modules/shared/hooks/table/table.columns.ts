/**
 * @module TableColumns
 */

import { ColumnsType } from 'antd/lib/table';
import { ReactNode } from 'react';
import { sorter } from './table.sorter';
/**
 * @template T Type of objects to be rendered in the table. Each object represents one table row.
 * @param dataSource Data to be rendered in the table. Each object in the array is one table row
 * @param translateHeader  Function used for editing a table row. Has access to all properties of the data represented in the row.
 * @param columnsOrder Order of columns in the table header. If columns order is not provided order of keys of object (type T) will be used for order of columns
 * @param customColumns Table columns that need to be rendered differently. Usually used for date formatting or extra styling
 * @param preventSort Disables sort on columns provided in the array. If true, all columns will have sort disabled
 * @returns Header of a custom table for {@link TableHook } hook.
 */
export const createColumns = <T>(
  dataSource: T[],
  translateHeader: (value: string) => string,
  columnsOrder?: (keyof T)[],
  customColumns?: Partial<Record<keyof T, (value: any, record: T, index: number) => ReactNode>>,
  preventSort?: (keyof T)[] | boolean,
): ColumnsType<T> => {
  const mappingObject = dataSource?.length ? dataSource[0] : null;
  const columns = (columnsOrder as string[]) || Object.keys(mappingObject ?? {});
  const returnSorter = (key: string): ((a: any, b: any) => number) | undefined => {
    return preventSort !== undefined &&
      ((typeof preventSort === 'boolean' && preventSort) ||
        (Array.isArray(preventSort) && preventSort.includes(key as keyof T)))
      ? undefined
      : (a, b): number => sorter(a[key as keyof T], b[key as keyof T]);
  };
  return columns
    .filter((el) => el !== 'id' && (!columnsOrder || columnsOrder?.includes(el as keyof T)))
    .sort((a, b) => {
      if (!columnsOrder) {
        return 0;
      }
      return columnsOrder!.indexOf(a as keyof T) - columnsOrder!.indexOf(b as keyof T);
    })
    .map((key, i) => {
      return {
        title: translateHeader(key),
        dataIndex: key,
        key: i,
        showSorterTooltip: false,
        defaultSortOrder: key === 'sequence' ? 'ascend' : undefined,
        sorter: returnSorter(key),
        render: customColumns?.[key as keyof T],
      };
    });
};
