/**
 * @module ColorsPage
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
import { filterColors } from '../settings/redux/colors/slice';
import {
  deleteColorsThunk,
  getAllColors,
  upsertColorsThunk,
} from '../settings/redux/colors/thunks';

/**
 * Settings pages reuse the same logic. The difference is in used thunks (eg upsertArticleThunk, deleteArticleThunk) and data (passed down to hooks via stateSelector const)
 * For more info see {@link ArticlesPage | Articles Page}
 * @returns Colors Page
 */
const Colors: FC = () => {
  const ns = 'colors';
  const stateSelector = (state: CombinedState<StoreType>): SettingsPagesResponse => state.colors;
  const { loading, filtered, form } = useSettingsPages(getAllColors, filterColors, stateSelector);
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
      <div data-testid='departments' className='settings-layout'>
        <SettingsTable
          isLoading={loading!}
          filteredData={filtered}
          translateNs='settings'
          columnsOrder={settingsColumnsOrder}
          onDelete={onDelete}
          onNew={showModal}
          onEdit={showModal}
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
          upsertThunk={upsertColorsThunk}
        />
        <SettingsDeleteModal
          isOpen={isDeleteModalOpen}
          onClose={closeDeleteModal}
          nameSpace={ns}
          settingsEntity={itemToDelete!}
          selector={stateSelector}
          deleteThunk={deleteColorsThunk}
        />
      </div>
    </FormProvider>
  );
};
export default Colors;
