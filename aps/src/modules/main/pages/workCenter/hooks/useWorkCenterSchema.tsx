/**
 * @module useWorkCenterSchema
 */

import { useTranslate } from '@/modules/shared/hooks/translate.hook';
import { Shape } from '@/modules/shared/yup/yup.schema';
import { useMemo } from 'react';
import { OptionalObjectSchema, TypeOfShape } from 'yup/lib/object';
import { AnyObject } from 'yup/lib/types';
import * as Yup from 'yup';
import { WorkCenterFormData } from '../../settings/redux/workCenters/interfaces';

type UserShape = Shape<WorkCenterFormData>;
/**
 *  Schema used for Work center form. Validates user inputs and renders errors in case the values don't match the Schema rules
 */
export const useWorkCenterSchema = (): OptionalObjectSchema<
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
      Yup.object<Shape<WorkCenterFormData>>({
        id: Yup.number().notRequired(),
        name: requiredString.max(30, translate('max_length', { name: '30' })),
        departmentId: requiredNumber,
        workCenter_Id: Yup.number().notRequired(),
        allocationBased: Yup.number(),
        isActive: Yup.boolean().default(true),
        remark: Yup.string().max(200, translate('max_length', { name: '200' })),
        unitOfMeasureId: Yup.number()
          .transform((value) => (isNaN(value) ? undefined : value))
          .notRequired(),
        workCenterInterfaceId: Yup.string().max(15, translate('max_length', { name: '15' })),
      }),
    [requiredNumber, requiredString, translate],
  );
  return schema;
};
