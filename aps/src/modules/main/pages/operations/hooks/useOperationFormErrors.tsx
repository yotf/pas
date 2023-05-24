/**
 * @module UseOperationFormErrors
 */

import { useUniqueFieldValidation } from '@/modules/shared/hooks/uniqueFieldValidation.hook';
import { UseFormReturn } from 'react-hook-form';
import { useAppSelector } from '../../../../../store/hooks';
import { useTranslate } from '../../../../shared/hooks/translate.hook';
import { OperationFormData } from '../../settings/redux/operations/interfaces';
/**
 *
 * @param form RHF Form of type OperationFormData. Contains methods like watch, setValue, setError etc.
 * The form is passed down to {@link UseUniqueFieldValidation} hook which handles error displaying.
 */
export const useOperationFormErrors = (
  form: UseFormReturn<OperationFormData, any>,
): UseFormReturn<OperationFormData, any> => {
  const { validationErrors } = useAppSelector((state) => state.operation);
  const { translate } = useTranslate({
    ns: 'operations',
    keyPrefix: 'validation',
  });

  useUniqueFieldValidation({
    form,
    propertyName: 'name',
    validationError: validationErrors ? validationErrors[0] : undefined,
    translate,
  });

  return form;
};
