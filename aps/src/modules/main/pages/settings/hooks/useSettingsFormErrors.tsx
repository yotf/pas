/**
 * @module useSettingsFormErrors
 */

import { useTranslate } from '@/modules/shared/hooks/translate.hook';
import { useUniqueFieldValidation } from '@/modules/shared/hooks/uniqueFieldValidation.hook';
import { StoreType } from '@/store';
import { useAppSelector } from '@/store/hooks';
import { CombinedState } from '@reduxjs/toolkit';
import { UseFormReturn } from 'react-hook-form';
import { SettingsPageItem, SettingsPagesResponse } from '../consts/interfaces';
/**
 *
 * @param form RHF Form of type SettingsPageItem. Contains methods like watch, setValue, setError etc.
 * @param ns Localization Namespace
 * @param stateDirectory Redux state of type SettingsPagesResponse
 * @param isOpen Used for error clearing
 * @param propForValidation Fields in form that need to be unique in the table. Default if 'code' field.
 * @returns Form for a SettingsPageItem. The {@link UseUniqueFieldValidation } hook handles error logic.
 */
export const useSettingsFormErrors = (
  form: UseFormReturn<SettingsPageItem, any>,
  ns: string,
  stateDirectory: (state: CombinedState<StoreType>) => SettingsPagesResponse,
  isOpen: boolean,
  propForValidation?: keyof SettingsPageItem,
): UseFormReturn<SettingsPageItem, any> => {
  const { validationErrors } = useAppSelector(stateDirectory);
  const { translate } = useTranslate({
    ns: ns,
    keyPrefix: 'validation',
  });

  const propName = propForValidation || 'code';

  useUniqueFieldValidation({
    form,
    propertyName: propName,
    validationError: validationErrors ? validationErrors[0] : undefined,
    translate,
    shouldClear: isOpen,
    ns: ns,
  });

  return form;
};
