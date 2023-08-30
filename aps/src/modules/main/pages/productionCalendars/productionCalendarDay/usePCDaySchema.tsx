/**
 * @module usePCDaySchema
 */

import { useTranslate } from '@/modules/shared/hooks/translate.hook';
import { Shape } from '@/modules/shared/yup/yup.schema';
import { useMemo } from 'react';
import { OptionalObjectSchema, TypeOfShape } from 'yup/lib/object';
import { AnyObject } from 'yup/lib/types';
import { ProductionCalendarDayMapped } from '../../settings/redux/productionCalendarsWorkCapacities/interfaces';
import * as Yup from 'yup';
import dayjs from 'dayjs';

type UserShape = Shape<ProductionCalendarDayMapped>;
/**
 *  Schema used for {@link ProductionCalendarDayModal}. Validates user inputs and renders errors in case the values don't match the Schema rules
 */
export const usePCDaySchema = (
  productionCalendarDay: ProductionCalendarDayMapped,
): OptionalObjectSchema<UserShape, AnyObject, TypeOfShape<UserShape>> => {
  const { translate } = useTranslate({
    ns: 'workCenters',
    keyPrefix: 'validation',
  });
  const requiredString = Yup.string().required(translate('required'));
  const requiredNumber = Yup.number()
    .transform((value) => (isNaN(value) ? undefined : value))
    .required(translate('required'))
    .moreThan(-1, translate('positive'));

  const notRequiredString = Yup.string().notRequired();
  const notRequiredNumber = Yup.number().notRequired();

  const isBeforeToday = dayjs(productionCalendarDay?.date).isBefore(dayjs());
  const schema = useMemo(
    () =>
      Yup.object<Shape<ProductionCalendarDayMapped>>({
        id: Yup.number().notRequired(),
        start: isBeforeToday ? notRequiredString : requiredString,
        end: isBeforeToday ? notRequiredString : requiredString,
        break: isBeforeToday
          ? notRequiredNumber
          : requiredNumber.test({
              name: 'breakTest',
              message: translate('break_exceed'),
              test: (value, context) => {
                const minutes = context.parent.minutes;
                if (minutes < 0) return false;
                return true;
              },
            }),
        efficiency: isBeforeToday
          ? notRequiredNumber
          : requiredNumber
              .min(0, translate('min_value', { value: '0' }))
              .max(100, translate('max_value', { value: '100' })),
        minutes: Yup.number()
          .notRequired()
          .min(0, translate(''))
          .transform((value) => (isNaN(value) ? undefined : value)),
        availableMinutes: Yup.number()
          .notRequired()
          .transform((value) => (isNaN(value) ? undefined : value)),
        date: Yup.string().notRequired(),
        remark: Yup.string()
          .notRequired()
          .transform((value) => value || '')
          .max(200, translate('max_length', { name: '200' })),
        capacity: Yup.number()
          .transform((value) => (isNaN(value) ? undefined : value))
          .notRequired()
          .moreThan(-1, translate('positive')),
        dayOfWeek: Yup.number().notRequired(),
        isWorkingDay: Yup.boolean().notRequired(),
      }),
    [
      isBeforeToday,
      notRequiredNumber,
      notRequiredString,
      requiredNumber,
      requiredString,
      translate,
    ],
  );
  return schema;
};
