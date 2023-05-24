/**
 * @module useWorkCapacitiesSchema
 */

import { useTranslate } from '@/modules/shared/hooks/translate.hook';
import { Shape } from '@/modules/shared/yup/yup.schema';
import { useMemo } from 'react';
import { OptionalObjectSchema, TypeOfShape } from 'yup/lib/object';
import { AnyObject } from 'yup/lib/types';
import * as Yup from 'yup';
import { WorkCapacityMapped } from '../../settings/redux/workcenterCapacities/interfaces';

type UserShape = Shape<WorkCapacityMapped>;
/**
 *  Schema used for Work Capacity Form. Validates user inputs and renders errors in case the values don't match the Schema rules
 */
export const useWorkCapacitiesSchema = (): OptionalObjectSchema<
  UserShape,
  AnyObject,
  TypeOfShape<UserShape>
> => {
  const { translate } = useTranslate({
    ns: 'workCenters',
    keyPrefix: 'validation',
  });
  const requiredString = Yup.string().required(translate('required'));
  const requiredNumber = Yup.number()
    .transform((value) => (isNaN(value) ? undefined : value))
    .required(translate('required'))
    .moreThan(-1, translate('positive'));

  const schema = useMemo(
    () =>
      Yup.object<Shape<WorkCapacityMapped>>({
        id: Yup.number().notRequired(),
        start: requiredString,
        end: requiredString,
        break: requiredNumber.max(9999, translate('max_length', { name: '4' })),
        efficiency: requiredNumber
          .min(0, translate('min_value', { value: '0' }))
          .max(100, translate('max_value', { value: '100' })),
        minutes: Yup.number().notRequired(),
        availableMinutes: Yup.number().notRequired(),
        capacity: Yup.number()
          .notRequired()
          .moreThan(-1, translate('positive'))
          .max(9999, translate('max_length', { name: '4' })),
      }),
    [requiredNumber, requiredString, translate],
  );
  return schema;
};
