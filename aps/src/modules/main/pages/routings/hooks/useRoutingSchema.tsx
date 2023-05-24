/**
 * @module useRoutingSchema
 */

import { Shape } from '@/modules/shared/yup/yup.schema';
import { useMemo } from 'react';
import * as Yup from 'yup';
import { OptionalObjectSchema, TypeOfShape } from 'yup/lib/object';
import { AnyObject } from 'yup/lib/types';
import { useTranslate } from '../../../../shared/hooks/translate.hook';
import { RoutingFormData } from '../../settings/redux/routings/interfaces';

type EntityShape = Shape<RoutingFormData>;
/**
 *  Schema used for {@link RoutingsForm}. Validates user inputs and renders errors in case the values don't match the Schema rules
 */
export const useRoutingSchema = (): OptionalObjectSchema<
  EntityShape,
  AnyObject,
  TypeOfShape<EntityShape>
> => {
  const { translate } = useTranslate({
    ns: 'routings',
    keyPrefix: 'validation',
  });
  const schema = useMemo(
    () =>
      Yup.object<Shape<Required<RoutingFormData>>>({
        id: Yup.number().notRequired(),
        routing_Id: Yup.number().notRequired(),
        routingInterfaceId: Yup.string()
          .notRequired()
          .max(14, translate('max_length', { value: '14' }))
          .transform((val) => val || undefined),
        name: Yup.string()
          .required(translate('required'))
          .max(30, translate('max_length', { value: '30' })),
        customerId: Yup.number()
          .notRequired()
          .transform((val) => val || undefined),
        lotStandardQuantity: Yup.number()
          .required(translate('required'))
          .min(1, translate('min_value', { value: '1' }))
          .max(99999, translate('max_digits', { value: '5' }))
          .transform((value) => value || 0),
        remark: Yup.string().max(200, translate('max_length', { value: '200' })),
        isActive: Yup.boolean().required(translate('required')),
        materialId: Yup.number().notRequired(),
        unitOfMeasureId: Yup.string().notRequired(),
        routingAddAndUpdateOperations: Yup.array(Yup.object())
          .required()
          .min(1) as unknown as Yup.AnyObjectSchema,
      }),
    [translate],
  );
  return schema;
};
