/**
 * @module useProductionOrderModalSchema
 */

import { Shape } from '@/modules/shared/yup/yup.schema';
import { useMemo } from 'react';
import * as Yup from 'yup';
import { OptionalObjectSchema, TypeOfShape } from 'yup/lib/object';
import { AnyObject } from 'yup/lib/types';
import { useTranslate } from '../../../../shared/hooks/translate.hook';
import { ProductionOrderFormData } from '../../settings/redux/productionOrders/interfaces';
import { ProductionOrderModalForm } from '../../settings/redux/productionOrders/productionOrdersModal/interfaces';

type EntityShape = Shape<ProductionOrderModalForm>;
/**
 *  Schema used for {@link useProductionOrderModal} hooks form. Validates user inputs and renders errors in case the values don't match the Schema rules
 */
export const useProductionOrderModalSchema = (): OptionalObjectSchema<
  EntityShape,
  AnyObject,
  TypeOfShape<EntityShape>
> => {
  const { translate } = useTranslate({
    ns: 'productionOrderModal',
    keyPrefix: 'validation',
  });

  const numberRequired = useMemo(
    () =>
      Yup.number()
        .required(translate('required'))
        .transform((val: number | undefined) => val || undefined),
    [translate],
  );

  const numberNotRequired = useMemo(
    () =>
      Yup.number()
        .notRequired()
        .transform((val: number | undefined) => val || undefined),
    [],
  );

  const stringNotRequired = Yup.string().notRequired();

  const schema = useMemo(
    () =>
      Yup.object<Shape<Required<ProductionOrderModalForm>>>({
        numberOfProductionOrders: numberRequired
          .min(1, translate('min_length'))
          .max(99, translate('max_length', { value: '2' })),
        productionOrderTypeId: numberRequired,
        routingId: numberRequired,
        lotStandardQuantity: numberNotRequired,
        productionOrders: Yup.array(
          Yup.object<Shape<Required<ProductionOrderFormData>>>({
            id: numberNotRequired,
            orderNumber: numberNotRequired,
            statusOfPlanningEnum: numberNotRequired,
            situationEnum: numberRequired,
            productionOrderTypeId: numberRequired,
            customerId: numberRequired,
            customerOrderNumber: stringNotRequired,
            salesOrderId: numberNotRequired,
            salesOrderMaterialId: numberNotRequired,
            materialId: numberNotRequired,
            routingId: numberNotRequired,
            initialDate: Yup.string().notRequired(),
            finalDelivery: stringNotRequired,
            foreseenDeliveryPOOrigin: stringNotRequired,
            productionOrderNumber: numberNotRequired,
            origin: numberNotRequired,
            quantity1: numberRequired
              .min(1, translate('min_length'))
              .max(99999, translate('max_length', { value: '5' })),
            quantity2: numberRequired,
            quantity3: numberNotRequired,
            unitOfMeasure1Id: numberNotRequired,
            unitOfMeasure2Id: numberNotRequired,
            unitOfMeasure3Id: numberNotRequired,
            remark: stringNotRequired,
            creationDate: Yup.string().notRequired(),
            foreseenDelivery: stringNotRequired,
            salesOrderDelivery: stringNotRequired.nullable(),
            materialGroupId: numberNotRequired,
            articleId: numberNotRequired,
            colorId: numberNotRequired,
            thicknessId: numberNotRequired,
            selectionId: numberNotRequired,
            statusOfPlanningBoolean: Yup.boolean().default(true),
            routingAddAndUpdateOperations: Yup.array(
              Yup.object(),
            ) as unknown as Yup.AnyObjectSchema,

            pO_RoutingOperationAddAndUpdateDtos: Yup.array(
              Yup.object(),
            ).notRequired() as unknown as Yup.AnyObjectSchema,
          }),
        )
          .required()
          .min(1) as unknown as Yup.AnyObjectSchema as unknown as Yup.AnyObjectSchema,
      }),

    [numberNotRequired, numberRequired, stringNotRequired, translate],
  );
  return schema;
};
