/**
 * @module ParametersPage
 */

import { parametersColumnOrder } from '@/modules/shared/consts/columnsOrder';
import { useSettingsCustomColumns } from '@/modules/shared/hooks/table/settings/useSettingsCustomColumns.hook';
import { translateMaxLengthMessage } from '@/modules/shared/utils/utils';
import { Shape } from '@/modules/shared/yup/yup.schema';
import { StoreType } from '@/store';
import { CombinedState } from '@reduxjs/toolkit';
import { FC, useCallback } from 'react';
import { FormProvider } from 'react-hook-form';
import { RequiredStringSchema } from 'yup/lib/string';
import { AnyObject } from 'yup/lib/types';
import SettingsDeleteModal from '../settings/components/settings-modals/settings-delete-modal.component';
import SettingsModal from '../settings/components/settings-modals/settings-modal.component';
import SettingsTable from '../settings/components/settingsTable';
import { SettingsPageItem, SettingsPagesResponse } from '../settings/consts/interfaces';
import { useSettingPageSetup } from '../settings/consts/settingPageSetup';
import { useSettingsPages } from '../settings/hooks/settingsPages.hook';
import { filterParameters } from '../settings/redux/parameters/slice';
import {
  deleteParametersThunk,
  getAllParameters,
  upsertParametersThunk,
} from '../settings/redux/parameters/thunks';
import ParametersForm from './components/parameters-form.component';
/**
 * Settings pages reuse the same logic. The difference is in used thunks (eg upsertArticleThunk, deleteArticleThunk) and data (passed down to hooks via stateSelector const)
 * For more info see {@link ArticlesPage | Articles Page}
 * @returns Parameters Page
 */
const Parameters: FC = () => {
  const ns = 'parameters';
  const stateSelector = (state: CombinedState<StoreType>): SettingsPagesResponse =>
    state.parameters;
  const { loading, filtered, form } = useSettingsPages(
    getAllParameters,
    filterParameters,
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
  } = useSettingPageSetup(stateSelector, { unit: '' });

  const extendsSettingsSchemaProps = useCallback(
    (
      requiredStringCallback: RequiredStringSchema<string | undefined, AnyObject>,
      translateCallback: (value: string, options?: Record<string, string> | undefined) => string,
    ): Partial<Shape<SettingsPageItem>> => {
      return {
        unit: requiredStringCallback.max(5, translateMaxLengthMessage(5, translateCallback)),
      };
    },
    [],
  );

  return (
    <FormProvider {...form}>
      <div data-testid='parameters' className='settings-layout'>
        <SettingsTable
          isLoading={loading!}
          filteredData={filtered}
          translateNs='settings'
          columnsOrder={parametersColumnOrder}
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
          upsertThunk={upsertParametersThunk}
          extendsSettingsSchemaProps={extendsSettingsSchemaProps}
        >
          <ParametersForm />
        </SettingsModal>
        <SettingsDeleteModal
          isOpen={isDeleteModalOpen}
          onClose={closeDeleteModal}
          nameSpace='parameters'
          settingsEntity={itemToDelete!}
          selector={stateSelector}
          deleteThunk={deleteParametersThunk}
        />
      </div>
    </FormProvider>
  );
};
export default Parameters;
