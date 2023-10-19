/**
 * @module CustomersPage
 */

import { customersColumnOrder } from '@/modules/shared/consts/columnsOrder';
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
import { filterCustomers } from '../settings/redux/customers/slice';
import {
  deleteCustomersThunk,
  getAllCustomers,
  upsertCustomerThunk,
} from '../settings/redux/customers/thunks';
import CustomersForm from './components/customers-form.component';

/**
 * Settings pages reuse the same logic. The difference is in used thunks (eg upsertArticleThunk, deleteArticleThunk) and data (passed down to hooks via stateSelector const).
 * Also, some pages have additional properties (eg 'unit', 'country', 'holidayDate')
 * For more info see {@link ArticlesPage | Articles Page}
 * @returns Customers Page
 */
const Customers: FC = () => {
  const ns = 'customers';
  const stateSelector = (state: CombinedState<StoreType>): SettingsPagesResponse => state.customers;
  const { loading, filtered, form } = useSettingsPages(
    getAllCustomers,
    filterCustomers,
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
  } = useSettingPageSetup(stateSelector, { country: '' });

  const extendsSettingsSchemaProps = useCallback(
    (
      requiredStringCallback: RequiredStringSchema<string | undefined, AnyObject>,
      translateCallback: (value: string, options?: Record<string, string> | undefined) => string,
    ): Partial<Shape<SettingsPageItem>> => {
      return {
        country: requiredStringCallback.max(50, translateMaxLengthMessage(50, translateCallback)),
        name: requiredStringCallback.max(50, translateMaxLengthMessage(50, translateCallback)),
      };
    },
    [],
  );

  return (
    <FormProvider {...form}>
      {loading && (
        <div className='spinner-overlay'>
          <div className='loader-container'>
            <span className='loader-20'></span>
          </div>
        </div>
      )}
      <div data-testid='customers' className='settings-layout'>
        <SettingsTable
          isLoading={loading!}
          filteredData={filtered}
          translateNs='settings'
          columnsOrder={customersColumnOrder}
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
          upsertThunk={upsertCustomerThunk}
          extendsSettingsSchemaProps={extendsSettingsSchemaProps}
        >
          <CustomersForm />
        </SettingsModal>
        <SettingsDeleteModal
          isOpen={isDeleteModalOpen}
          onClose={closeDeleteModal}
          nameSpace='customers'
          settingsEntity={itemToDelete!}
          selector={stateSelector}
          deleteThunk={deleteCustomersThunk}
        />
      </div>
    </FormProvider>
  );
};
export default Customers;
