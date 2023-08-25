/**
 * @module UserSchema
 */

import { translateMaxLengthMessage } from '@/modules/shared/utils/utils';
import { useMemo } from 'react';
import * as Yup from 'yup';
import { OptionalObjectSchema, TypeOfShape } from 'yup/lib/object';
import { AnyObject } from 'yup/lib/types';
import { useTranslate } from '../../../../shared/hooks/translate.hook';
import { Shape } from '../../../../shared/yup/yup.schema';
import { UserFormData } from '../../settings/redux/user/interfaces';

type UserShape = Shape<UserFormData>;
/**
 *  Schema used for {@link UserForm} component. Validates user inputs and renders errors in case the values don't match the Schema rules
 */
export const useUserSchema = (
  user: UserFormData,
): OptionalObjectSchema<UserShape, AnyObject, TypeOfShape<UserShape>> => {
  const { translate } = useTranslate({
    ns: 'users',
    keyPrefix: 'validation',
  });
  const requiredString = Yup.string().required(translate('required'));
  const maxLength = 20;
  const maxLengthTranslate = translateMaxLengthMessage(maxLength, translate);
  const schema = useMemo(
    () =>
      Yup.object<Shape<UserFormData>>({
        id: Yup.string().notRequired(),
        firstName: requiredString.max(maxLength, maxLengthTranslate),
        lastName: requiredString.max(maxLength, maxLengthTranslate),
        userName: requiredString.max(maxLength, maxLengthTranslate),
        password: (user?.id
          ? Yup.string()
              .transform((value, originalValue) => (value === '' ? undefined : originalValue))
              .notRequired()
          : requiredString
        ).min(6, translate('pass_min_character')),
        email: requiredString.email(translate('format')),
        isActive: Yup.bool().default(true),
        phoneNumber: Yup.string()
          .matches(/^[+]?(\s*|\d+)$/, translate('numeric'))
          .max(maxLength, maxLengthTranslate),
        roleId: requiredString,
        language: requiredString,
        positionId: Yup.number()
          .notRequired()
          .transform((value, originalValue) => (isNaN(value) ? undefined : originalValue)),
      }),
    [requiredString, translate, user, maxLengthTranslate],
  );
  return schema;
};
