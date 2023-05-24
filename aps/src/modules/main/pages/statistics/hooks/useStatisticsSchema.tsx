/**
 * @module useStatisticsSchema
 */

import { Shape } from '@/modules/shared/yup/yup.schema';
import { useMemo } from 'react';
import * as Yup from 'yup';
import { OptionalObjectSchema, TypeOfShape } from 'yup/lib/object';
import { AnyObject } from 'yup/lib/types';
import { useTranslate } from '../../../../shared/hooks/translate.hook';
import { StatisticsFormData } from '../../settings/redux/statistics/interfaces';
import dayjs from 'dayjs';

type EntityShape = Shape<StatisticsFormData>;
export const useStatisticsSchema = (): OptionalObjectSchema<
  EntityShape,
  AnyObject,
  TypeOfShape<EntityShape>
> => {
  const { translate } = useTranslate({
    ns: 'overview',
    keyPrefix: 'validation',
  });

  const schema = useMemo(
    () =>
      Yup.object<Shape<Required<StatisticsFormData>>>({
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

        finalDate: Yup.string().required(translate('required')),

        workCenters: Yup.array(Yup.number())
          .required(translate('required'))
          .min(1, translate('min_length')) as unknown as Yup.AnyObjectSchema,
      }),
    [translate],
  );
  return schema;
};
