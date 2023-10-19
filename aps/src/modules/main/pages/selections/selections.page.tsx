/**
 * @module SelectionsPage
 */

import { settingsColumnsOrder } from '@/modules/shared/consts/columnsOrder';
import { useSettingsCustomColumns } from '@/modules/shared/hooks/table/settings/useSettingsCustomColumns.hook';
import { FC } from 'react';
import { FormProvider } from 'react-hook-form';
import SettingsTable from '../settings/components/settingsTable';
import { SettingsPagesResponse } from '../settings/consts/interfaces';
import { useSettingsPages } from '../settings/hooks/settingsPages.hook';
import { filterSelections } from '../settings/redux/selections/slice';

import { StoreType } from '@/store';
import { CombinedState } from '@reduxjs/toolkit';
import SettingsDeleteModal from '../settings/components/settings-modals/settings-delete-modal.component';
import SettingsModal from '../settings/components/settings-modals/settings-modal.component';
import { useSettingPageSetup } from '../settings/consts/settingPageSetup';
import {
  deleteSelectionsThunk,
  getAllSelections,
  upsertSelectionsThunk,
} from '../settings/redux/selections/thunks';
/**
 * Settings pages reuse the same logic. The difference is in used thunks (eg upsertArticleThunk, deleteArticleThunk) and data (passed down to hooks via stateSelector const)
 * For more info see {@link ArticlesPage | Articles Page}
 * @returns Selections Page
 */
const Selections: FC = () => {
  const ns = 'selections';
  const stateSelector = (state: CombinedState<StoreType>): SettingsPagesResponse =>
    state.selections;
  const { loading, filtered, form } = useSettingsPages(
    getAllSelections,
    filterSelections,
    stateSelector,
  );
  const {
    itemToDelete,
    isDeleteModalOpen,
    isModalOpen,
    settingsItem,
    disableButton,
    showModal,
    closeModal,
    onDelete,
    closeDeleteModal,
    translate,
  } = useSettingPageSetup(stateSelector);
  return (
    <FormProvider {...form}>
      {loading && (
        <div className='spinner-overlay'>
          <div className='loader-container'>
            <span className='loader-20'></span>
          </div>
        </div>
      )}
      <div data-testid='selections' className='settings-layout'>
        <SettingsTable
          isLoading={loading!}
          filteredData={filtered}
          translateNs='settings'
          onNew={showModal}
          onEdit={showModal}
          onDelete={onDelete}
          columnsOrder={settingsColumnsOrder}
          customColumns={useSettingsCustomColumns(translate)}
          disableDeleteButtonCondition={disableButton}
          disableExportToExcelButton={true}
        />
        <SettingsModal
          isOpen={isModalOpen}
          settingsEntity={settingsItem!}
          nameSpace={ns}
          onClose={closeModal}
          selector={stateSelector}
          upsertThunk={upsertSelectionsThunk}
        />
        <SettingsDeleteModal
          isOpen={isDeleteModalOpen}
          onClose={closeDeleteModal}
          nameSpace={ns}
          settingsEntity={itemToDelete!}
          selector={stateSelector}
          deleteThunk={deleteSelectionsThunk}
        />
      </div>
    </FormProvider>
  );
};
export default Selections;
