/**
 * @module useWorkCenterFormErrors
 */

import { useUniqueFieldValidation } from '@/modules/shared/hooks/uniqueFieldValidation.hook';
import { UseFormReturn } from 'react-hook-form';
import { useAppSelector } from '../../../../../store/hooks';
import { useTranslate } from '../../../../shared/hooks/translate.hook';
import { WorkCenterFormData } from '../../settings/redux/workCenters/interfaces';
/**
 * @param form RHF Form of type WorkCenterFormData. Contains methods like watch, setValue, setError etc.
 * The form is passed down to {@link UseUniqueFieldValidation} hook which handles error displaying.
 */
export const useWorkCenterFormErrors = (
  form: UseFormReturn<WorkCenterFormData, any>,
): UseFormReturn<WorkCenterFormData, any> => {
  const { validationErrors } = useAppSelector((state) => state.workCenter);
  const { translate } = useTranslate({
    ns: 'workCenters',
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
