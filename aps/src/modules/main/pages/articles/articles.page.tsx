/**
 * @module ArticlesPage
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
import { filterArticles } from '../settings/redux/articles/slice';
import {
  deleteArticleThunk,
  getAllArticles,
  upsertArticleThunk,
} from '../settings/redux/articles/thunks';
/**
 * The stateSelector const passed down to the {@link useSettingsPages} hook determines which data is fetched, filtered and shown to the user.
 * Filtered data is passed down to {@link SettingsTable} component and rendered.  {@link SettingsModal} and {@link SettingsDeleteModal} recieve thunks
 * (eg upsertArticleThunk, deleteArticleThunk if its the Articles Page) for deleting and creating/editing the items rendered in the table.
 * If the item type SettingsPageItem has additional properties they are added to the {@link useSettingPageSetup} hook as props and extendsSettingsSchemaProps function needs to be
 * created to extend the {@link useSettingsSchema}
 * Callback and state returned from {@link useSettingPageSetup} hook is passed down to modals and {@link SettingsTable} as props.
 * @returns Articles Page
 */
const Articles: FC = () => {
  const ns = 'articles';
  const stateSelector = (state: CombinedState<StoreType>): SettingsPagesResponse => state.articles;
  const { loading, filtered, form } = useSettingsPages(
    getAllArticles,
    filterArticles,
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
      <div data-testid='articles' className='settings-layout'>
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
          upsertThunk={upsertArticleThunk}
        />
        <SettingsDeleteModal
          isOpen={isDeleteModalOpen}
          onClose={closeDeleteModal}
          nameSpace={ns}
          settingsEntity={itemToDelete!}
          selector={stateSelector}
          deleteThunk={deleteArticleThunk}
        />
      </div>
    </FormProvider>
  );
};
export default Articles;
