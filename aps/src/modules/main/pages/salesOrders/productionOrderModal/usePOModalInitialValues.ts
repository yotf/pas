/**
 * @module usePOModalInitialValues
 */

import { MaintainContext } from '@/modules/main/components/maintain/contexts/maintain.context';
import { PlanningStatus, POSituation } from '@/modules/shared/consts';
import { useAppSelector } from '@/store/hooks';
import dayjs from 'dayjs';
import { useContext, useEffect, useMemo } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { Material } from '../../settings/redux/materials/interfaces';
import { ProductionOrderFormData } from '../../settings/redux/productionOrders/interfaces';
import { ProductionOrderModalForm } from '../../settings/redux/productionOrders/productionOrdersModal/interfaces';
import { SalesMaterialFormData } from '../../settings/redux/salesOrders/interfaces';

export type UsePOModalInitialValuesProps = {
  form: UseFormReturn<ProductionOrderModalForm, any>;
  selectedMaterial: SalesMaterialFormData | undefined;
  selectedMaterialFull: Material | undefined;
};
/**
 *
 * @param form Form defined in {@link useProductionOrderModal}
 * @param  selectedMaterial Material selected by the user
 * @param selectedMaterialFull Material filtered from all materials, needed since selected material is mapped and lacks certain values
 * @returns Initial values of production order generated in {@link POModalActions} component. The initial values are calculated based on user inputs.
 */
export const usePOModalInitialValues = ({
  form,
  selectedMaterial,
  selectedMaterialFull,
}: UsePOModalInitialValuesProps): ProductionOrderFormData => {
  const {
    state: { entity },
  } = useContext(MaintainContext);

  const { data: routings } = useAppSelector((state) => state.routings);

  const { watch, setValue } = form;

  const { routingId, numberOfProductionOrders, productionOrderTypeId } = watch();

  const selectedRouting = useMemo(
    () => routings.find((routing) => routing.id === routingId),
    [routings, routingId],
  );

  useEffect(() => {
    if (!selectedRouting) return;
    setValue('lotStandardQuantity', selectedRouting?.lotStandardQuantity);
  }, [selectedMaterial, selectedRouting, setValue]);

  useEffect(() => {
    if (!selectedMaterial || !selectedRouting) return;
    setValue(
      'numberOfProductionOrders',
      Math.ceil(Number(selectedMaterial!.quantity1! / selectedRouting?.lotStandardQuantity ?? 0)),
    );
  }, [selectedMaterial, selectedRouting, setValue]);

  const productionOrderInitial: ProductionOrderFormData = useMemo(
    () => ({
      id: 0,
      orderNumber: entity?.orderNumber,
      statusOfPlanningEnum: PlanningStatus.document,
      situationEnum: POSituation.open,
      productionOrderTypeId: productionOrderTypeId,
      customerId: entity?.customerId,
      customerOrderNumber: entity?.customerOrderNumber,
      salesOrderId: entity?.id,
      salesOrderMaterialId: selectedMaterial?.id,
      routingId: selectedRouting?.id,
      creationDate: dayjs().format(),
      initialDate: dayjs().format(),
      salesOrderDelivery: entity?.salesOrderDelivery || undefined,
      statusOfPlanningBoolean: true,
      materialId: selectedMaterial?.materialId,
      quantity1: selectedMaterial?.quantity1
        ? Number((selectedMaterial?.quantity1 / (numberOfProductionOrders || 1)).toFixed(2))
        : 0,
      quantity2: selectedMaterial?.quantity1
        ? selectedMaterial?.quantity1 / (selectedMaterialFull?.factorAreaToPc || 1)
        : 0,
      quantity3: selectedMaterial?.quantity1
        ? selectedMaterial?.quantity1 / (selectedMaterialFull?.factorAreaToKG || 1)
        : 0,
      unitOfMeasure1Id: selectedMaterialFull?.unitOfMeasure1Id,
      unitOfMeasure2Id: selectedMaterialFull?.unitOfMeasure2Id,
      //TODO change uom when BE adds the property
      unitOfMeasure3Id: selectedMaterialFull?.unitOfMeasure1Id,
      remark: '',
      pO_RoutingOperationAddAndUpdateDtos: [],
    }),
    [
      entity,
      numberOfProductionOrders,
      productionOrderTypeId,
      selectedMaterial,
      selectedMaterialFull,
      selectedRouting,
    ],
  );
  return productionOrderInitial;
};
