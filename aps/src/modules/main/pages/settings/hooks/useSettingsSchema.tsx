/**
 * @module useSettingsSchema
 */

import { useTranslate } from '@/modules/shared/hooks/translate.hook';
import { removeExtraSpaces, translateMaxLengthMessage } from '@/modules/shared/utils/utils';
import { Shape } from '@/modules/shared/yup/yup.schema';
import * as Yup from 'yup';
import { OptionalObjectSchema, TypeOfShape } from 'yup/lib/object';
import { RequiredStringSchema } from 'yup/lib/string';
import { AnyObject } from 'yup/lib/types';
import { SettingsPageItem } from '../../settings/consts/interfaces';

type SettingsShape = Shape<SettingsPageItem>;
/**
 *  Schema used for SettingsPageItem Forms. Validated user inputs and renders errors in case the values don't match the Schema
 * @param extendsSettingsSchemaProps Used when The SettingsPageItem has additional properties for validation. Default properties are id, name and code.
 */
export const useSettingsSchema = (
  nameSpace: string,
  extendsSettingsSchemaProps?: (
    requiredStringCallback: RequiredStringSchema<string | undefined, AnyObject>,
    translateCallback: (value: string, options?: Record<string, string> | undefined) => string,
  ) => Partial<Shape<SettingsPageItem>>,
): OptionalObjectSchema<SettingsShape, AnyObject, TypeOfShape<SettingsShape>> => {
  const { translate } = useTranslate({
    ns: nameSpace,
    keyPrefix: 'validation',
  });
  const requiredString = Yup.string().required(translate('required'));
  const maxLength = 20;
  const maxLengthTranslate = translateMaxLengthMessage(maxLength, translate);
  const extendsSettingsSchema = extendsSettingsSchemaProps
    ? extendsSettingsSchemaProps(
        requiredString.transform((value: string) => removeExtraSpaces(value)),
        translate,
      )
    : {};
  const schema = Yup.object<Shape<SettingsPageItem>>({
    code: requiredString.max(maxLength, maxLengthTranslate),
    name: requiredString.max(maxLength, maxLengthTranslate),
    ...extendsSettingsSchema,
  });
  return schema;
};
