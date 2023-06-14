/**
 * @module useProductionOrderSchema
 */

import { Shape } from '@/modules/shared/yup/yup.schema';
import { useMemo } from 'react';
import * as Yup from 'yup';
import { OptionalObjectSchema, TypeOfShape } from 'yup/lib/object';
import { AnyObject } from 'yup/lib/types';
import { useTranslate } from '../../../../shared/hooks/translate.hook';
import { ProductionOrderFormData } from '../../settings/redux/productionOrders/interfaces';

type EntityShape = Shape<ProductionOrderFormData>;
/**
 *  Schema used for {@link ProductionOrderForm}. Validates user inputs and renders errors in case the values don't match the Schema rules
 */
export const useProductionOrderSchema = (): OptionalObjectSchema<
  EntityShape,
  AnyObject,
  TypeOfShape<EntityShape>
> => {
  const { translate } = useTranslate({
    ns: 'productionOrder',
    keyPrefix: 'validation',
  });
  const numberNotRequired = useMemo(
    () =>
      Yup.number()
        .notRequired()
        .transform((val) => val || undefined),
    [],
  );

  const numberRequired = useMemo(
    () =>
      Yup.number()
        .required(translate('required'))
        .transform((val) => val || undefined),
    [translate],
  );

  const stringNotRequired = Yup.string().notRequired();
  const schema = useMemo(
    () =>
      Yup.object<Shape<Required<ProductionOrderFormData>>>({
        id: numberNotRequired,
        orderNumber: numberNotRequired,
        statusOfPlanningEnum: numberRequired,
        situationEnum: numberRequired,
        productionOrderTypeId: numberRequired,
        customerId: numberRequired,
        customerOrderNumber: stringNotRequired,
        salesOrderId: numberNotRequired,
        productionOrderNumber: numberNotRequired,
        materialId: numberRequired,
        routingId: numberNotRequired,
        initialDate: Yup.string().notRequired(),
        finalDelivery: stringNotRequired,
        salesOrderMaterialId: numberNotRequired,
        foreseenDeliveryPOOrigin: stringNotRequired,
        origin: numberNotRequired,
        quantity1: numberRequired
          .min(1, translate('min_length', { name: '1' }))
          .max(99999, translate('max_length', { name: '99999' })),
        quantity2: numberNotRequired,
        quantity3: numberNotRequired,
        unitOfMeasure1Id: numberNotRequired,
        unitOfMeasure2Id: numberNotRequired,
        unitOfMeasure3Id: numberNotRequired,
        remark: stringNotRequired,
        creationDate: Yup.string().notRequired(),
        foreseenDelivery: stringNotRequired,
        salesOrderDelivery: stringNotRequired,
        materialGroupId: numberNotRequired,
        articleId: numberNotRequired,
        colorId: numberNotRequired,
        thicknessId: numberNotRequired,
        selectionId: numberNotRequired,
        statusOfPlanningBoolean: Yup.boolean().notRequired(),
        routingAddAndUpdateOperations: Yup.array(Yup.object()) as unknown as Yup.AnyObjectSchema,
        pO_RoutingOperationAddAndUpdateDtos: Yup.array(
          Yup.object(),
        ) as unknown as Yup.AnyObjectSchema,
        // .required()
        // .min(1) as unknown as Yup.AnyObjectSchema
      }),
    [numberNotRequired, numberRequired, stringNotRequired, translate],
  );
  return schema;
};
