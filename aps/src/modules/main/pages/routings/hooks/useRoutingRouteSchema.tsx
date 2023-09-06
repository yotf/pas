/**
 * @module useRoutingRouteSchema
 */

import { Shape } from '@/modules/shared/yup/yup.schema';
import { useMemo } from 'react';
import * as Yup from 'yup';
import { OptionalObjectSchema, TypeOfShape } from 'yup/lib/object';
import { AnyObject } from 'yup/lib/types';
import { useTranslate } from '../../../../shared/hooks/translate.hook';
import { RoutingRouteFormData } from '../../settings/redux/routings/interfaces';

type EntityShape = Shape<RoutingRouteFormData>;
/**
 *  Schema used for Routing route Forms. Validates user inputs and renders errors in case the values don't match the Schema rules.
 */
export const useRoutingRouteSchema = (
  maxSequence?: number,
  isPlannedPO?: boolean,
): OptionalObjectSchema<EntityShape, AnyObject, TypeOfShape<EntityShape>> => {
  if (maxSequence !== undefined) {
    maxSequence++;
  }
  const { translate } = useTranslate({
    ns: 'routings',
    keyPrefix: 'routes.validation',
  });

  const timeValidator: {
    name: string;
    message: string;
    test: Yup.TestFunction<number | undefined>;
  } = useMemo(
    () => ({
      name: 'length',
      message: translate('max_digits', { value: '4' }),
      test: (val = 0) => val.toString().replace('.', '').length <= 4,
    }),
    [translate],
  );

  const schema = useMemo(
    () =>
      Yup.object<Shape<Required<RoutingRouteFormData>>>({
        operationId: Yup.number().required(translate('required')),
        id: Yup.number().notRequired(),
        standardTime: Yup.number()
          .required(translate('required'))
          // .test(timeValidator)
          .typeError(translate('required'))

          .min(0.011, translate('min_value', { value: '0.011' }))
          .max(2880, translate('max_value', { value: '2880' }))
          .transform((value) => (isNaN(value) ? undefined : value)),
        setupTime: Yup.number()
          .notRequired()
          //.test(timeValidator)

          .min(0.011, translate('min_value', { value: '0.011' }))
          .max(2880, translate('max_value', { value: '2880' }))
          .transform((value) => (isNaN(value) ? undefined : value)),
        waitingTime: Yup.number()
          .notRequired()
          //.test(timeValidator)

          .min(0.011, translate('min_value', { value: '0.011' }))
          .max(2880, translate('max_value', { value: '2880' }))
          .transform((value) => (isNaN(value) ? undefined : value)),
        leadTime: Yup.number()
          .required(translate('required'))
          .min(0, translate('min_value', { value: '0' }))
          .max(99, translate('max_digits', { value: '2' }))
          .typeError(translate('required'))
          .transform((value) => (isNaN(value) ? undefined : value)),
        planning: Yup.boolean().required(),
        remark: Yup.string()
          .notRequired()
          .max(200, translate('max_length', { value: '200' })),
        departmentName: Yup.string().notRequired(),
        operationName: Yup.string().notRequired(),
        sequence: maxSequence
          ? Yup.number()
              .required()
              .min(1, translate('min_value', { value: '1' }))
              .max(maxSequence, translate('max_value', { value: maxSequence.toString() }))
              .typeError(translate('must_be_number'))
              .transform((val) => Number(val) || 0)
          : Yup.number().required(),
        guid: Yup.string().notRequired(),
        executedDate: Yup.string().notRequired(),
        planningDate: Yup.string().notRequired(),
        operationTime: Yup.number().notRequired(),
        pO_OperationStatusEnum: Yup.number().notRequired(),
        workCenterId: Yup.number().notRequired(),
        skipped: Yup.boolean().notRequired(),
      }).test('skipped-or-executedDate', translate('skipped_or_executedDate_required'), (value) => {
        const { skipped, executedDate } = value;
        if (!skipped && !executedDate && isPlannedPO) {
          return false; // Either skipped or executedDate must be provided
        }
        return true;
      }),
    [maxSequence, timeValidator, translate, isPlannedPO],
  );
  return schema;
};
