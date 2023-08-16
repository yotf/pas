/**
 * @module useOverviewSchema
 */

import { Shape } from '@/modules/shared/yup/yup.schema';
import dayjs from 'dayjs';
import { useMemo } from 'react';
import { Message } from 'react-hook-form';
import * as Yup from 'yup';
import { OptionalObjectSchema, TypeOfShape } from 'yup/lib/object';
import { AnyObject } from 'yup/lib/types';
import { useTranslate } from '../../../../shared/hooks/translate.hook';
import { OverviewFormData } from '../../settings/redux/overview/interfaces';

type EntityShape = Shape<OverviewFormData>;
/**
 *  Schema used for {@link OverviewPage}. Validates user inputs and renders errors in case the values don't match the Schema rules
 */
export const useOverviewSchema = (): OptionalObjectSchema<
  EntityShape,
  AnyObject,
  TypeOfShape<EntityShape>
> => {
  const { translate } = useTranslate({
    ns: 'overview',
    keyPrefix: 'validation',
  });

  const numberNotRequired = useMemo(
    () =>
      Yup.number()
        .notRequired()
        .transform((val) => val || undefined),
    [],
  );

  const dateRangeValidation = (value: string | undefined, context: Yup.TestContext): boolean => {
    const { originalValue } = context as Yup.TestContext<string | undefined> & {
      originalValue: string | undefined;
    };

    if (originalValue) return dayjs(originalValue).diff(context.parent.initialDate, 'day') < 14;
    return true;
  };

  const dateRangeValidator: {
    name: string;
    message: Message;
    test: Yup.TestFunction<string | undefined>;
  } = useMemo(
    () => ({
      name: '1',
      message: translate('date_range'),
      test: dateRangeValidation,
    }),
    [translate],
  );

  const schema = useMemo(
    () =>
      Yup.object<Shape<Required<OverviewFormData>>>({
        initialDate: Yup.string()
          .required(translate('required'))
          .test({
            name: 'initialTest',
            message: translate('initial_date_lower'),
            test: (value, context) => {
              const finalDate = context.parent.finalDate;
              if (!finalDate) return true;
              return !dayjs(finalDate).isBefore(dayjs(value), 'day');
            },
          }),

        finalDate: Yup.string()
          .required(translate('required'))
          .when('initialDate', {
            is: '',
            then: (unitSchema) => unitSchema,
            otherwise: (unitSchema) => unitSchema.test(dateRangeValidator),
          }),

        workCenters: Yup.array(Yup.number())
          .required(translate('required'))
          .min(1, translate('min_length')) as unknown as Yup.AnyObjectSchema,
        //    .max(10, translate('max_length')) as unknown as Yup.AnyObjectSchema,
        pendingDays: numberNotRequired,
        orderType: numberNotRequired,
        productionOrder: numberNotRequired,
      }),
    [dateRangeValidator, numberNotRequired, translate],
  );
  return schema;
};
