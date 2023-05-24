/**
 * @module FeaturesPage
 */

import { FC } from 'react';
import { FormProvider } from 'react-hook-form';
import SettingsTable from '../settings/components/settingsTable';
import { SettingsPagesResponse } from '../settings/consts/interfaces';
import { useSettingsPages } from '../settings/hooks/settingsPages.hook';
import { filterFeatures } from '../settings/redux/features/slice';
import {
  deleteFeatureThunk,
  getAllFeatures,
  upsertFeatureThunk,
} from '../settings/redux/features/thunks';

import { settingsColumnsOrder } from '@/modules/shared/consts/columnsOrder';
import { useSettingsCustomColumns } from '@/modules/shared/hooks/table/settings/useSettingsCustomColumns.hook';
import { StoreType } from '@/store';
import { CombinedState } from '@reduxjs/toolkit';
import SettingsDeleteModal from '../settings/components/settings-modals/settings-delete-modal.component';
import SettingsModal from '../settings/components/settings-modals/settings-modal.component';
import { useSettingPageSetup } from '../settings/consts/settingPageSetup';
/**
 * Settings pages reuse the same logic. The difference is in used thunks (eg upsertArticleThunk, deleteArticleThunk) and data (passed down to hooks via stateSelector const).
 * Also, some pages have additional properties (eg 'unit', 'country', 'holidayDate')
 * For more info see {@link ArticlesPage | Articles Page}
 * @returns Features Page
 */
const Features: FC = () => {
  const ns = 'features';
  const stateSelector = (state: CombinedState<StoreType>): SettingsPagesResponse => state.features;
  const { loading, filtered, form } = useSettingsPages(
    getAllFeatures,
    filterFeatures,
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
      <div data-testid='features' className='settings-layout'>
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
      </div>
      <SettingsModal
        isOpen={isModalOpen}
        settingsEntity={settingsItem!}
        nameSpace={ns}
        onClose={closeModal}
        selector={stateSelector}
        upsertThunk={upsertFeatureThunk}
      />
      <SettingsDeleteModal
        isOpen={isDeleteModalOpen}
        onClose={closeDeleteModal}
        nameSpace={ns}
        settingsEntity={itemToDelete!}
        selector={stateSelector}
        deleteThunk={deleteFeatureThunk}
      />
    </FormProvider>
  );
};
export default Features;
