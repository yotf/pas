/**
 * @module UnitOfMeasurePage
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
import { filterUnitOfMeasure } from '../settings/redux/unitOfMeasure/slice';
import {
  deleteUnitOfMeasureThunk,
  getAllUnitsOfMeasure,
  upsertUnitOfMeasureThunk,
} from '../settings/redux/unitOfMeasure/thunks';
/**
 * Settings pages reuse the same logic. The difference is in used thunks (eg upsertArticleThunk, deleteArticleThunk) and data (passed down to hooks via stateSelector const)
 * For more info see {@link ArticlesPage | Articles Page}
 * @returns UnitsOfMeasure Page
 */
const UnitsOfMeasure: FC = () => {
  const ns = 'unit_of_measure';
  const stateSelector = (state: CombinedState<StoreType>): SettingsPagesResponse =>
    state.unitOfMeasure;
  const { loading, filtered, form } = useSettingsPages(
    getAllUnitsOfMeasure,
    filterUnitOfMeasure,
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
      <div data-testid='unit-of-measure' className='settings-layout'>
        <SettingsTable
          isLoading={loading!}
          filteredData={filtered}
          translateNs='settings'
          onDelete={onDelete}
          onNew={showModal}
          onEdit={showModal}
          columnsOrder={settingsColumnsOrder}
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
          upsertThunk={upsertUnitOfMeasureThunk}
        />
        <SettingsDeleteModal
          isOpen={isDeleteModalOpen}
          onClose={closeDeleteModal}
          nameSpace={ns}
          settingsEntity={itemToDelete!}
          selector={stateSelector}
          deleteThunk={deleteUnitOfMeasureThunk}
        />
      </div>
    </FormProvider>
  );
};
export default UnitsOfMeasure;
