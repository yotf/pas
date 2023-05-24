/**
 * @module PositionsPage
 */

import { columnsOrderPositions } from '@/modules/shared/consts/columnsOrder';
import { FC, useCallback } from 'react';
import { FormProvider } from 'react-hook-form';
import SettingsTable from '../settings/components/settingsTable';
import { useSettingsPages } from '../settings/hooks/settingsPages.hook';
import { filterPositions } from '../settings/redux/positions/slice';
import { getAllPositions } from '../settings/redux/positions/thunks';
import { StoreType } from '@/store';
import { CombinedState } from '@reduxjs/toolkit';
import { SettingsPageItem, SettingsPagesResponse } from '../settings/consts/interfaces';
import { useSettingPageSetup } from '../settings/consts/settingPageSetup';
import SettingsModal from '../settings/components/settings-modals/settings-modal.component';
import SettingsDeleteModal from '../settings/components/settings-modals/settings-delete-modal.component';
import { deletePositionThunk, upsertPositionThunk } from './../settings/redux/positions/thunks';
import PositionsForm from './components/positions-form';
import { RequiredStringSchema } from 'yup/lib/string';
import { translateMaxLengthMessage } from '@/modules/shared/utils/utils';
import { Shape } from '@/modules/shared/yup/yup.schema';
import { AnyObject } from 'yup/lib/types';
import { useSettingsCustomColumns } from '@/modules/shared/hooks/table/settings/useSettingsCustomColumns.hook';
/**
 * Settings pages reuse the same logic. The difference is in used thunks (eg upsertArticleThunk, deleteArticleThunk) and data (passed down to hooks via stateSelector const)
 * For more info see {@link ArticlesPage | Articles Page}
 * @returns Positions Page
 */
const Positions: FC = () => {
  const ns = 'positions';
  const stateSelector = (state: CombinedState<StoreType>): SettingsPagesResponse => state.positions;
  const { loading, filtered, form } = useSettingsPages(
    getAllPositions,
    filterPositions,
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

  const extendsSettingsSchemaProps = useCallback(
    (
      requiredStringCallback: RequiredStringSchema<string | undefined, AnyObject>,
      translateCallback: (value: string, options?: Record<string, string> | undefined) => string,
    ): Partial<Shape<SettingsPageItem>> => {
      return {
        name: requiredStringCallback.max(30, translateMaxLengthMessage(30, translateCallback)),
        code: requiredStringCallback.notRequired(),
      };
    },
    [],
  );

  return (
    <FormProvider {...form}>
      <div data-testid='positions' className='settings-layout'>
        <SettingsTable
          isLoading={loading!}
          filteredData={filtered}
          translateNs='settings'
          columnsOrder={columnsOrderPositions}
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
          upsertThunk={upsertPositionThunk}
          extendsSettingsSchemaProps={extendsSettingsSchemaProps}
          propForValidation={'name'}
        >
          <PositionsForm />
        </SettingsModal>
        <SettingsDeleteModal
          isOpen={isDeleteModalOpen}
          onClose={closeDeleteModal}
          nameSpace={ns}
          settingsEntity={itemToDelete!}
          selector={stateSelector}
          deleteThunk={deletePositionThunk}
        />
      </div>
    </FormProvider>
  );
};
export default Positions;
