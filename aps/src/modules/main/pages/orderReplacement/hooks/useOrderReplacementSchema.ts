/**
 * @module useOrderReplacementSchema
 */

import { useTranslate } from '@/modules/shared/hooks/translate.hook';
import { Shape } from '@/modules/shared/yup/yup.schema';
import { useMemo } from 'react';
import * as Yup from 'yup';
import { OptionalObjectSchema, TypeOfShape } from 'yup/lib/object';
import { AnyObject } from 'yup/lib/types';
import { OrderReplacementFormData } from '../../settings/redux/orderReplacement/interfaces';

type EntityShape = Shape<OrderReplacementFormData>;
/**
 *  Schema used for {@link OrderReplacementPage} form. Validates user inputs and renders errors in case the values don't match the Schema rules
 */
export const useOrderReplacementSchema = (): OptionalObjectSchema<
  EntityShape,
  AnyObject,
  TypeOfShape<EntityShape>
> => {
  const { translate } = useTranslate({
    ns: 'orderReplacement',
    keyPrefix: 'validation',
  });
  const numberRequired = useMemo(
    () =>
      Yup.number()
        .required(translate('required'))
        .typeError(translate('required'))
        .transform((val) => val || undefined),
    [translate],
  );
  const schema = useMemo(
    () =>
      Yup.object<Shape<Required<OrderReplacementFormData>>>({
        inCustomerId: numberRequired,
        inSalesOrderNumberId: numberRequired,
        outCustomerId: numberRequired,
        outSalesOrderNumberId: numberRequired,
      }),
    [numberRequired],
  );
  return schema;
};
