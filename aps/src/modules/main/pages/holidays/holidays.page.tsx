/**
 * @module HolidaysPage
 */

import { holidayColumnOrder } from '@/modules/shared/consts/columnsOrder';
import { useDateFormat } from '@/modules/shared/hooks/dateFormatData.hook';
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
import { filterHolidays } from '../settings/redux/holidays/slice';
import {
  deleteHolidayThunk,
  getAllHolidays,
  upsertHolidayThunk,
} from '../settings/redux/holidays/thunks';
import HolidayForm from './components/holiday-form.component';
/**
 * Settings pages reuse the same logic. The difference is in used thunks (eg upsertArticleThunk, deleteArticleThunk) and data (passed down to hooks via stateSelector const).
 * Also, some pages have additional properties (eg 'unit', 'country', 'holidayDate')
 * For more info see {@link ArticlesPage | Articles Page}
 * @returns Holidays Page
 */
const Holidays: FC = () => {
  const stateSelector = (state: CombinedState<StoreType>): SettingsPagesResponse => state.holidays;
  const { loading, filtered, form } = useSettingsPages(
    getAllHolidays,
    filterHolidays,
    stateSelector,
  );
  const ns = 'holidays';
  const formatedData = useDateFormat(filtered);

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
        holidayDate: requiredStringCallback,
        name: requiredStringCallback.max(30, translateMaxLengthMessage(30, translateCallback)),
        code: requiredStringCallback.notRequired(),
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
      <div data-testid='holidays' className='settings-layout'>
        <SettingsTable
          isLoading={loading!}
          filteredData={formatedData}
          translateNs='settings'
          onDelete={onDelete}
          onNew={showModal}
          onEdit={showModal}
          columnsOrder={holidayColumnOrder}
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
          upsertThunk={upsertHolidayThunk}
          extendsSettingsSchemaProps={extendsSettingsSchemaProps}
          propForValidation={'holidayDate'}
        >
          <HolidayForm />
        </SettingsModal>
        <SettingsDeleteModal
          isOpen={isDeleteModalOpen}
          onClose={closeDeleteModal}
          nameSpace={ns}
          settingsEntity={itemToDelete!}
          selector={stateSelector}
          deleteThunk={deleteHolidayThunk}
        />
      </div>
    </FormProvider>
  );
};
export default Holidays;
