/**
 * @module useGenerateProductionCalendarSchema
 */

import { useTranslate } from '@/modules/shared/hooks/translate.hook';
import { Shape } from '@/modules/shared/yup/yup.schema';
import { useMemo } from 'react';
import * as Yup from 'yup';
import { OptionalObjectSchema, TypeOfShape } from 'yup/lib/object';
import { AnyObject } from 'yup/lib/types';
import { GenerateProductionCalendarFormData } from '../../settings/redux/productionCalendars/interfaces';

type EntityShape = Shape<GenerateProductionCalendarFormData>;
/**
 *  Schema used for {@link ProductionCalendarsMaintain} and {@link ProductionCalendarsChecking} pages. Validates user inputs and renders errors in case the values don't match the Schema rules
 */
export const useGenerateProductionCalendarSchema = (): OptionalObjectSchema<
  EntityShape,
  AnyObject,
  TypeOfShape<EntityShape>
> => {
  const { translate } = useTranslate({ ns: 'productionCalendar', keyPrefix: 'validation' });

  const schema = useMemo(
    () =>
      Yup.object<Shape<Required<GenerateProductionCalendarFormData>>>({
        finalDate: Yup.string().required(translate('required')),
        initialDate: Yup.string().required(translate('required')),
        workCenterIds: Yup.array(Yup.number()).min(
          1,
          translate('min_length'),
        ) as unknown as Yup.AnyObjectSchema,
        holidays: Yup.array(Yup.object()).notRequired() as unknown as Yup.AnyObjectSchema,
      }),
    [translate],
  );
  return schema;
};
