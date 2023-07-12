/**
 * @module SettingsTable
 */

import copy from '@/assets/icons/copy.svg';
import plusIcon from '@/assets/plus.png';
import searchIcon from '@/assets/search.png';
import CustomButton from '@/modules/shared/components/button/button.component';
import CustomInput from '@/modules/shared/components/input/input.component';
import { useTable } from '@/modules/shared/hooks/table/table.hook';
import { useTranslate } from '@/modules/shared/hooks/translate.hook';
import {
  createCustomFilter,
  FormCustomFilter,
  PageTableAdditionalElements,
} from '@/modules/shared/utils/utils';
import { RefTable } from 'antd/es/table/interface';
import { ReactNode, useCallback } from 'react';
import { useFormContext, UseFormReturn } from 'react-hook-form';
import './settingsTable.scss';
/**
 * @template T Type of entity rendered in the table
 */
export interface SettingTableProps<T> {
  /** Filtered data to be rendered in the table  */
  filteredData: T[];
  /** Localization Namespace */
  translateNs: string;
  /** The data is loading if the API call for fetching table data is in pending state */
  isLoading: boolean;
  /** Order of table columns represented as key of T */
  columnsOrder?: (keyof T)[];
  /** Callback function for creating a new entity. Opens a modal or leads to a new page. */
  onNew?: () => void;
  /** Callback function for editing an existing entity. Opens a modal or leads to a new page. */
  onEdit?: (value: T) => void;
  /** Callback function for deleting an entity. Opens a modal. */
  onDelete?: (value: T) => void;
  /** Columns that need to be rendered differently in the table (eg need a specific background, padding or value formatting) */
  customColumns?: Partial<Record<keyof T, (value: any) => ReactNode>>;
  /** Condition that disables the delete action */
  disableDeleteButtonCondition?: (obj: T) => boolean | undefined;
  /** Specifies which columns dont need to be sortable. Boolean true disables sort on all columns */
  preventSort?: (keyof T)[] | boolean;
  /** Additional components to be rendered above the table*/
  additionalElements?: PageTableAdditionalElements;
  /** Defines if table rows are selectable via checkboxes */
  rowSelection?: Partial<RefTable>;
  /** Export to excel function. Used with data returned from {@link ExportToExcelContext}. */
  exportToExcel?: () => void;
  /** Condition for disabling export to excel */
  disableExportToExcelButton?: boolean;
  /**Specifies whether to render the delete button in table actions */
  renderDeleteButton?: boolean;
  /**Specifices number of rows per table page  */
  pageSize?: number;
}
/**
 * @template T Type of entity rendered in the table
 * @returns A table with logic for new, edit, delete and filter functionalities. The {@link TableHook} hook is used for creating the table.
 */
const SettingsTable = <T extends object>({
  filteredData,
  translateNs,
  isLoading,
  columnsOrder,
  onNew,
  onEdit,
  onDelete,
  customColumns,
  rowSelection,
  additionalElements,
  disableDeleteButtonCondition,
  preventSort,
  exportToExcel,
  disableExportToExcelButton,
  renderDeleteButton,
  pageSize,
}: SettingTableProps<T>): JSX.Element => {
  const { translate } = useTranslate({
    ns: translateNs,
  });

  const doNew = useCallback(() => onNew?.(), [onNew]);

  const { register } = useFormContext();
  const handleRowDoubleClick = (
    record: any,
    index: number | undefined,
    event: React.MouseEvent<HTMLElement>,
  ) => {
    onEdit ? onEdit(record) : null;
  };

  const table = useTable({
    dataSource: filteredData,
    translateHeader: translate,
    onEdit,
    onDelete,
    columnsOrder,
    customColumns,
    disableDeleteButtonCondition,
    preventSort,
    rowSelection,
    renderDeleteButton,
    pageSize,
    handleRowDoubleClick,
  });
  const form: UseFormReturn<FormCustomFilter, any> = useFormContext();
  const onExportToExcel = useCallback(() => exportToExcel?.(), [exportToExcel]);
  return isLoading ? (
    <></>
  ) : (
    <>
      <div className='inputs'>
        <div className='filters'>
          <CustomInput
            type='text'
            placeholder={translate('search')}
            icon={searchIcon}
            register={register('search')}
          />
          {additionalElements &&
            additionalElements.filters.map((filter) => createCustomFilter(form, filter))}
        </div>
        <div className='buttons'>
          {onNew && (
            <CustomButton type='button' color='blue' onClick={doNew}>
              <div className='button-children'>
                <img src={plusIcon} alt='' />
                <span>{translate('new_button')}</span>
              </div>
            </CustomButton>
          )}
          {additionalElements && additionalElements.buttons}
          {!disableExportToExcelButton && (
            <CustomButton type='button' color='green' onClick={onExportToExcel}>
              <div className='button-children'>
                <img src={copy} alt='' />
                <span>{translate('excel_button')}</span>
              </div>
            </CustomButton>
          )}
        </div>
      </div>
      <div data-testid='settings_table' className='table-wrapper'>
        {table}
      </div>
    </>
  );
};

export default SettingsTable;
