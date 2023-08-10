/**
 * @module useSalesOrderMaterialsSchema
 */

import { Shape } from '@/modules/shared/yup/yup.schema';
import { useMemo } from 'react';
import * as Yup from 'yup';
import { OptionalObjectSchema, TypeOfShape } from 'yup/lib/object';
import { AnyObject } from 'yup/lib/types';
import { useTranslate } from '../../../../shared/hooks/translate.hook';
import { SalesMaterialFormData } from '../../settings/redux/salesOrders/interfaces';

type EntityShape = Shape<SalesMaterialFormData>;
/**
 *  Schema used for Sales order material form in {@link SalesOrderModal}. Validates user inputs and renders errors in case the values don't match the Schema rules.
 */
export const useSalesOrderMaterialsSchema = (
  maxSequence?: number,
): OptionalObjectSchema<EntityShape, AnyObject, TypeOfShape<EntityShape>> => {
  if (maxSequence !== undefined) {
    maxSequence++;
  }

  const { translate } = useTranslate({
    ns: 'salesOrder',
    keyPrefix: 'validation',
  });

  const schema = useMemo(
    () =>
      Yup.object<Shape<Required<SalesMaterialFormData>>>({
        id: Yup.number().notRequired(),
        materialDescription: Yup.string().notRequired(),
        materialId: Yup.number().required(translate('required')),
        materialName: Yup.string(),
        quantity1: Yup.number()
          .min(0, translate('min_value', { value: '0' }))
          .max(999999, translate('max_digits', { value: '6' }))
          .transform((val) => val || undefined)
          .required(translate('required')),
        quantity2: Yup.number()
          .transform((val) => val || undefined)
          .required(translate('required')),
        requestedDelivery: Yup.string().transform((value) => value || undefined),
        salesOrderId: Yup.number(),
        tanneryDelivery: Yup.string().transform((val) => val || undefined),
        unitOfMeasure1: Yup.string(),
        unitOfMeasure2: Yup.string(),
        sequence: maxSequence
          ? Yup.number()
              .required(translate('required'))
              .min(1, translate('min_value', { value: '1' }))
              .max(maxSequence, translate('max_value', { value: maxSequence.toString() }))
              .typeError(translate('must_be_number'))
              .transform((val) => val || undefined)
          : Yup.number()
              .required(translate('required'))
              .min(0, translate('min_value'))
              .transform((val) => val || undefined),
        guid: Yup.string().notRequired(),
      }),
    [maxSequence, translate],
  );
  return schema;
};
