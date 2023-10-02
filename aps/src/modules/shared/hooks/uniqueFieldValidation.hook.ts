/**
 * @module UseUniqueFieldValidation
 */

import { SettingsValidationError } from '@/modules/main/pages/settings/consts/interfaces';
import { ValidationError } from '@/modules/main/pages/settings/redux/validation-error.type';
import { useEffect, useMemo, useState } from 'react';
import { UseFormReturn } from 'react-hook-form';

export interface UniqueFieldValidationProps<T extends object> {
  /** Form whose fields are being validated */
  form: UseFormReturn<any, any>;
  /** Name of property to be validated */
  propertyName: keyof T;
  /** Error message */
  validationError: ValidationError | SettingsValidationError | undefined;
  /** Localization function */
  translate: (value: string, options?: Record<string, string> | undefined) => string;
  /** Sets if error message should be cleared after being set or saved for next render */
  shouldClear?: boolean;
  ns?: string;
}
/**
 * Renders errors below given propertyNames of the form
 */
export const useUniqueFieldValidation = <T extends object>({
  form,
  propertyName,
  validationError,
  translate,
  shouldClear = undefined,
  ns,
}: UniqueFieldValidationProps<T>): void => {
  const [lastFailedValue, setLastFailedValue] = useState<string | undefined>(undefined);

  const {
    clearErrors,
    setError,
    formState: { errors },
  } = form;

  const { [propertyName]: field } = form.watch();

  const duplicateError = useMemo(
    () => ({ type: 'custom', message: translate('duplicate') }),
    [translate],
  );

  useEffect(() => {
    return () => {
      setLastFailedValue(undefined);
    };
  }, [shouldClear]);

  useEffect(() => {
    const prop = propertyName.toString();
    if (!errors[propertyName] && field !== undefined && field === lastFailedValue) {
      if (ns !== 'unit_of_measure') setError(prop, duplicateError);
      return;
    }
    if (errors[propertyName] === duplicateError && field !== lastFailedValue) {
      clearErrors(prop);
      return;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    clearErrors,
    duplicateError,
    lastFailedValue,
    setError,
    propertyName,
    field,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    errors[propertyName],
  ]);

  useEffect(() => {
    if (!validationError) {
      return;
    } else {
      setLastFailedValue(field);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [validationError]);
};
