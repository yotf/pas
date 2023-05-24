/**
 * @module UserFormErrors
 */

import { useUniqueFieldValidation } from '@/modules/shared/hooks/uniqueFieldValidation.hook';
import { UseFormReturn } from 'react-hook-form';
import { useAppSelector } from '../../../../../store/hooks';
import { useTranslate } from '../../../../shared/hooks/translate.hook';
import { UserFormData } from '../../settings/redux/user/interfaces';
/**
 *
 * @param form RHF form with methods and callback
 * @returns User Form. Checks if validation erros occured while creating/editing a user and renders them in the form
 */
export const useUserFormErrors = (
  form: UseFormReturn<UserFormData, any>,
  isOpen: boolean,
): UseFormReturn<UserFormData, any> => {
  const { validationErrors } = useAppSelector((state) => state.users);
  const { translate } = useTranslate({
    ns: 'users',
    keyPrefix: 'validation',
  });

  useUniqueFieldValidation({
    form,
    propertyName: 'userName',
    validationError: validationErrors?.find((x) => x.code === 'DuplicateUserName'),
    translate,
    shouldClear: isOpen,
  });

  useUniqueFieldValidation({
    form,
    propertyName: 'email',
    validationError: validationErrors?.find((x) => x.code === 'DuplicateEmail'),
    translate,
    shouldClear: isOpen,
  });

  return form;
};
