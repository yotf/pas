/**
 * @module MaterialGroupsPage
 */

import { settingsColumnsOrder } from '@/modules/shared/consts/columnsOrder';
import { useSettingsCustomColumns } from '@/modules/shared/hooks/table/settings/useSettingsCustomColumns.hook';
import { StoreType } from '@/store';
import { CombinedState } from '@reduxjs/toolkit';
import { FC } from 'react';
import { FormProvider } from 'react-hook-form';
import SettingsDeleteModal from '../settings/components/settings-modals/settings-delete-modal.component';
import SettingsModal from '../settings/components/settings-modals/settings-modal.component';
import SettingsTable from '../settings/components/settingsTable';
import { SettingsPagesResponse } from '../settings/consts/interfaces';
import { useSettingPageSetup } from '../settings/consts/settingPageSetup';
import { useSettingsPages } from '../settings/hooks/settingsPages.hook';
import { filterMaterialGroups } from '../settings/redux/materialGroups/slice';
import {
  deleteMaterialGroups,
  getAllMaterialGroups,
  upsertMaterialGroups,
} from '../settings/redux/materialGroups/thunks';
/**
 * Settings pages reuse the same logic. The difference is in used thunks (eg upsertArticleThunk, deleteArticleThunk) and data (passed down to hooks via stateSelector const)
 * For more info see {@link ArticlesPage | Articles Page}
 * @returns MaterialGroups Page
 */
const MaterialGroups: FC = () => {
  const stateSelector = (state: CombinedState<StoreType>): SettingsPagesResponse =>
    state.materialGroups;
  const { loading, filtered, form } = useSettingsPages(
    getAllMaterialGroups,
    filterMaterialGroups,
    stateSelector,
  );
  const ns = 'material_groups';
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
      <div data-testid='material-groups' className='settings-layout'>
        <SettingsTable
          isLoading={loading!}
          filteredData={filtered}
          translateNs='settings'
          columnsOrder={settingsColumnsOrder}
          onNew={showModal}
          onEdit={showModal}
          onDelete={onDelete}
          customColumns={useSettingsCustomColumns(translate)}
          disableDeleteButtonCondition={disableButton}
          disableExportToExcelButton={true}
        />
        <SettingsModal
          isOpen={isModalOpen}
          settingsEntity={settingsItem!}
          onClose={closeModal}
          nameSpace={ns}
          selector={stateSelector}
          upsertThunk={upsertMaterialGroups}
        />
        <SettingsDeleteModal
          isOpen={isDeleteModalOpen}
          onClose={closeDeleteModal}
          nameSpace={ns}
          settingsEntity={itemToDelete!}
          selector={stateSelector}
          deleteThunk={deleteMaterialGroups}
        />
      </div>
    </FormProvider>
  );
};
export default MaterialGroups;
