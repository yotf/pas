/**
 * @module useSalesOrderSchema
 */

import { Shape } from '@/modules/shared/yup/yup.schema';
import { useMemo } from 'react';
import * as Yup from 'yup';
import { OptionalObjectSchema, TypeOfShape } from 'yup/lib/object';
import { AnyObject } from 'yup/lib/types';
import { useTranslate } from '../../../../shared/hooks/translate.hook';
import { SalesOrderFormData } from '../../settings/redux/salesOrders/interfaces';

type EntityShape = Shape<SalesOrderFormData>;
/**
 *  Schema used for {@link SalesOrderForm}. Validates user inputs and renders errors in case the values don't match the Schema rules
 */
export const useSalesOrderSchema = (): OptionalObjectSchema<
  EntityShape,
  AnyObject,
  TypeOfShape<EntityShape>
> => {
  const { translate } = useTranslate({
    ns: 'salesOrder',
    keyPrefix: 'validation',
  });

  const numberRequired = useMemo(() => Yup.number().required(translate('required')), [translate]);

  const numberNotRequired = useMemo(
    () =>
      Yup.number()
        .notRequired()
        .transform((val: any) => val || undefined),
    [],
  );
  const schema = useMemo(
    () =>
      Yup.object<Shape<Required<SalesOrderFormData>>>({
        id: numberNotRequired,
        customerId: numberRequired,
        customerOrderNumber: Yup.string()
          .notRequired()
          .max(20, translate('max_length', { value: '20' })),
        orderNumber: numberNotRequired,
        orderTypeId: numberRequired,
        remark: Yup.string()
          .notRequired()
          .max(200, translate('max_length', { value: '200' })),
        status: numberRequired,
        salesOrderMaterialsAddAndUpdate: Yup.array(Yup.object())
          .notRequired()
          .min(1) as unknown as Yup.AnyObjectSchema,
      }),
    [numberNotRequired, numberRequired, translate],
  );
  return schema;
};
