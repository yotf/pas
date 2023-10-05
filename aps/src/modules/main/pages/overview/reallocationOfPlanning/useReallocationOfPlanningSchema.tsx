/**
 * @module useReallocationOfPlanningSchema
 */

import { Shape } from '@/modules/shared/yup/yup.schema';
import { useMemo } from 'react';
import * as Yup from 'yup';
import { OptionalObjectSchema, TypeOfShape } from 'yup/lib/object';
import { AnyObject } from 'yup/lib/types';
import { ReallocationOfPlanningForm } from '../../settings/redux/reallocationOfPlanning/interfaces';

type EntityShape = Shape<ReallocationOfPlanningForm>;
/**
 *  Schema used for {@link useReallocationOfPlanningModal}. Validates user inputs and renders errors in case the values don't match the Schema rules
 */
export const useReallocationOfPlanningSchema = (): OptionalObjectSchema<
  EntityShape,
  AnyObject,
  TypeOfShape<EntityShape>
> => {
  const schema = useMemo(
    () =>
      Yup.object<Shape<Required<ReallocationOfPlanningForm>>>({
        productionOrderDelivery: Yup.string().notRequired(),
        productionOrderNumber: Yup.number().notRequired(),
        salesOrderDelivery: Yup.string().notRequired(),
        reallocationOperations: Yup.array(Yup.object())
          .notRequired()
          .min(1) as unknown as Yup.AnyObjectSchema,
        limitCapacity: Yup.boolean().required(),
      }),

    [],
  );
  return schema;
};
