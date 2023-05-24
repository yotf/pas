/**
 * @module PageTable
 */

import { useSettingsCustomColumns } from '@/modules/shared/hooks/table/settings/useSettingsCustomColumns.hook';
import { useTranslate } from '@/modules/shared/hooks/translate.hook';
import { AdditionalFilterInfo } from '@/modules/shared/utils/utils';
import { ActionCreatorWithPayload, AsyncThunk, CombinedState } from '@reduxjs/toolkit';
import { RefTable } from 'antd/es/table/interface';
import { ReactElement, ReactNode, useCallback } from 'react';
import { FormProvider, UseFormReturn } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { StoreType } from '../../../../store';
import { useAppSelector } from '../../../../store/hooks';
import { EDIT_PAGE, NEW_PAGE } from '../../consts/pageRouter';
import SettingsTable from '../../pages/settings/components/settingsTable';
import { EntityState } from '../../pages/settings/redux/entity-state.type';
import { IdentifiableEntity, IdType } from '../../pages/settings/redux/thunks';
import { useTableData } from './hooks/table.hook';
import { useEntityDeleteModal } from './hooks/useEntityDeleteModal';
import './table.scss';

/**
 * @template Entity Entity recieved from the API
 * @template EntityMapped Properties of Entity prepared for the table
 * @template SingleEntity One entity recieved from the API and shown on the Maintain page inside the context.
 */
export type TableProps<Entity, EntityMapped, SingleEntity> = {
  /** Localization Namespace */
  ns: string;
  /** Order of table columns */
  columnsOrder: (keyof EntityMapped)[];
  /** Thunk used for filtering table with search input (add link) */
  filterThunk: ActionCreatorWithPayload<string, string>;
  /** Thunk used to get one entity by Id */
  readThunk: AsyncThunk<Entity[], IdType, Record<string, unknown>>;
  /** Thunk used for deleting entity by id */
  deleteThunk: AsyncThunk<IdType, IdType, Record<string, unknown>>;
  /** Redux state used in table */
  stateSelector: (state: CombinedState<StoreType>) => EntityState<Entity, SingleEntity>;
  /** Mapping function. Accepts object type Entity, returns object type EntityMapped*/
  mapEntityToUiData: (entity: Entity) => EntityMapped;
  /** Returns name of Entity, used to present which entity is being deleted in the confirmation message */
  getName: (entity: EntityMapped) => string;
  /**  Specifies which columns in the table need to be rendered differently*/
  customColumns?: Partial<Record<keyof Entity & { status: number }, (value: any) => ReactNode>>;
  /** Specifies which columns don't need to be sortable */
  preventSort?: (keyof EntityMapped)[] | boolean;
  /** Used to search data by additional parameters */
  additionalSearch?: (
    form: UseFormReturn<{ search: string; status: number | string | undefined }, any>,
  ) => void;
  /** Renders additional Elements to be rendered above the table. Usually used with additionalFilter and additionalSearch props to create inputs which will trigger the additional filtering */
  additionalElements?: {
    filters: AdditionalFilterInfo[];
    buttons: JSX.Element;
  };
  /** Used to filter data by additional parameters */
  additionalFilter?: (data: EntityMapped[]) => EntityMapped[];
  /** Defines if table rows are selectable via checkboxes */
  rowSelection?: Partial<RefTable>;
  /** Export to excel function. Used with data returned from {@link ExportToExcelContext}. */
  exportToExcel?: () => void;
};
/**
 * @template Entity Entity recieved from the API
 * @template EntityMapped Properties of Entity prepared for the table
 * @template SingleEntity One entity recieved from the API and shown on the Maintain page inside the context.
 * @returns A {@link SettingsTable | Table} component with the props required to show the table data properly. Uses {@link useEntityDeleteModal} hook for delete modal.
 *
 */
const PageTable = <Entity, EntityMapped extends IdentifiableEntity, SingleEntity>({
  ns,
  columnsOrder,
  deleteThunk,
  getName,
  customColumns = {},
  preventSort,
  rowSelection,
  additionalElements,
  additionalSearch = undefined,
  exportToExcel,
  ...props
}: TableProps<Entity, EntityMapped, SingleEntity>): ReactElement => {
  const { stateSelector } = props;
  const state = useAppSelector(stateSelector);
  const { loading, uiData, form } = useTableData(props);
  const { translate } = useTranslate({ ns: ns });
  const navigate = useNavigate();
  /**
   * test
   */
  const showMaintain = useCallback(
    (value?: EntityMapped): void => {
      navigate(!value ? NEW_PAGE : EDIT_PAGE.replace(':id', `${value.id}`));
    },
    [navigate],
  );
  const { modal, onDelete } = useEntityDeleteModal({ ns, deleteThunk, getName, state });

  const disableButton = useCallback((obj: EntityMapped) => {
    return obj.status === undefined ? obj.isActive : obj.status !== 3;
  }, []);

  if (additionalSearch) {
    additionalSearch(form);
  }

  return (
    <FormProvider {...form}>
      <div data-testid='table' className='table-container'>
        <h1 className='table-container__title'>{translate('title')}</h1>
        <SettingsTable
          isLoading={loading!}
          filteredData={uiData}
          translateNs={ns}
          columnsOrder={columnsOrder}
          onNew={showMaintain}
          onEdit={showMaintain}
          onDelete={onDelete}
          customColumns={{ ...useSettingsCustomColumns<EntityMapped>(translate), ...customColumns }}
          disableDeleteButtonCondition={disableButton}
          preventSort={preventSort}
          additionalElements={additionalElements}
          rowSelection={rowSelection}
          exportToExcel={exportToExcel}
        />
      </div>
      {modal}
    </FormProvider>
  );
};

export default PageTable;
