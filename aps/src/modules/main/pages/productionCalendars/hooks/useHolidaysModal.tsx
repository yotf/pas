/**
 * @module useHolidaysModal
 */

import { translateMaxLengthMessage } from '@/modules/shared/utils/utils';
import { Shape } from '@/modules/shared/yup/yup.schema';
import { StoreType } from '@/store';
import { CombinedState } from '@reduxjs/toolkit';
import { useCallback, useState } from 'react';
import { RequiredStringSchema } from 'yup/lib/string';
import { AnyObject } from 'yup/lib/types';
import HolidayForm from '../../holidays/components/holiday-form.component';
import SettingsModal from '../../settings/components/settings-modals/settings-modal.component';
import { SettingsPageItem, SettingsPagesResponse } from '../../settings/consts/interfaces';
import { upsertHolidayThunk } from '../../settings/redux/holidays/thunks';

export type HolidaysModalReturn = {
  holidaysModal: JSX.Element;
  showHolidaysModal: () => void;
};
/**
 *
 * @param additionalCallback Additional function to be used when creating a new holiday. In this case, used for getting the data again from the API
 * @returns Modal component for creating a new holiday and a function to be used for opening it
 */
export const useHolidaysModal = (additionalCallback: () => void): HolidaysModalReturn => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [settingsItem, setSettingsItem] = useState<SettingsPageItem | undefined>(undefined);

  const ns = 'holidays';

  const showModal = useCallback(() => {
    setSettingsItem({
      code: '',
      name: '',
      isActive: true,
      holidayDate: '',
    } as SettingsPageItem);
    setIsModalOpen(true);
  }, []);
  const closeModal = useCallback(() => {
    setIsModalOpen(false);
  }, []);

  const extendsSettingsSchemaProps = useCallback(
    (
      requiredStringCallback: RequiredStringSchema<string | undefined, AnyObject>,
      translateCallback: (value: string, options?: Record<string, string> | undefined) => string,
    ): Partial<Shape<SettingsPageItem>> => {
      return {
        holidayDate: requiredStringCallback,
        name: requiredStringCallback.max(20, translateMaxLengthMessage(20, translateCallback)),
        code: requiredStringCallback.notRequired(),
      };
    },
    [],
  );

  const stateSelector = (state: CombinedState<StoreType>): SettingsPagesResponse => state.holidays;

  const holidaysModal = (
    <SettingsModal
      isOpen={isModalOpen}
      settingsEntity={settingsItem!}
      nameSpace={ns}
      onClose={closeModal}
      selector={stateSelector}
      upsertThunk={upsertHolidayThunk}
      extendsSettingsSchemaProps={extendsSettingsSchemaProps}
      propForValidation={'holidayDate'}
      callbackAfterSubmit={additionalCallback}
    >
      <HolidayForm />
    </SettingsModal>
  );
  return { holidaysModal, showHolidaysModal: showModal };
};
