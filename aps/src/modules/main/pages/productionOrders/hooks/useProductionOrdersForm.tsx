/**
 * @module useProductionOrderForm
 */

import { dateFormatter } from '@/modules/shared/utils/utils';
import dayjs from 'dayjs';
import { useCallback, useMemo } from 'react';
import { Path, UseFormReturn } from 'react-hook-form';
import { useMaintainForm } from '../../../components/maintain/hooks/useMaintainForm';
import {
  PORoutingOperations,
  ProductionOrderFormData,
  ProductionOrderResponse,
  ProductionOrdersResponse,
} from '../../settings/redux/productionOrders/interfaces';
import { clearProductionOrder } from '../../settings/redux/productionOrders/slice';
import { getProductionOrder } from '../../settings/redux/productionOrders/thunks';
import { useProductionOrderSchema } from './useProductionOrderSchema';
import { RoutingRouteFormData } from '../../settings/redux/routings/interfaces';

export type UseProductionOrderFormProps = {
  copy?: boolean;
  state: ProductionOrdersResponse;
};
/**
 * @param copy If copy is true values are copied from an already created Material and placed inside the form.
 * Creates a mapping function and a indicates which fields cannot be duplicated. Creates a validation schema using {@link useProductionOrderSchema}.
 * Mentioned values are passed down to {@link useMaintainForm}.
 * @returns A form created by {@link useMaintainForm}.
 */
export const useProductionOrderForm = ({
  state,
  copy,
}: UseProductionOrderFormProps): UseFormReturn<ProductionOrderFormData, any> => {
  const validationSchema = useProductionOrderSchema();
  const duplicateErrors: Record<string, Path<ProductionOrderFormData>> = useMemo(
    () => ({
      DuplicateProductionOrder: 'id',
    }),
    [],
  );

  const routingOperationMapper = useCallback(
    (obj: PORoutingOperations, i: number, arr: PORoutingOperations[]): RoutingRouteFormData => {
      const { operation } = obj;

      return {
        ...obj,
        operationName: operation?.name,
        departmentName: operation?.department?.name ?? '',
        id: copy ? 0 : operation.id,
        sequence: i + 1,
        workCenterId: undefined,
        planningDate: undefined,
        executedDate: undefined,
        operationTime: 0,
        pO_OperationStatusEnum: arr[i].pO_OperationStatusEnum ?? 1,
      };
    },
    [copy],
  );

  const mapEntityToFormData: (entity?: ProductionOrderResponse) => ProductionOrderFormData =
    useCallback(
      (entity) =>
        !entity || entity?.id === 0
          ? {
              id: 0,
              statusOfPlanningEnum: 1,
              situationEnum: 1,
              productionOrderTypeId: undefined,
              salesOrderId: undefined,
              customerId: undefined,
              customerOrderNumber: '',
              salesOrderMaterialId: undefined,
              routingId: undefined,
              creationDate: dateFormatter(dayjs().format()),
              salesOrderDelivery: '',
              initialDate: dayjs().add(1, 'day').format(),
              finalDelivery: undefined,
              foreseenDelivery: undefined,
              foreseenDeliveryPOOrigin: undefined,
              origin: undefined,
              quantity1: undefined,
              quantity2: undefined,
              quantity3: undefined,
              unitOfMeasure1Id: undefined,
              unitOfMeasure2Id: undefined,
              unitOfMeasure3Id: undefined,
              remark: '',
              pO_RoutingOperationAddAndUpdateDtos: [],
              routingAddAndUpdateOperations: [],
              materialGroupId: undefined,
              articleId: undefined,
              colorId: undefined,
              thicknessId: undefined,
              selectionId: undefined,
            }
          : {
              id: entity.id,
              statusOfPlanningEnum: entity.statusOfPlanningEnum,
              situationEnum: entity.situationEnum,
              productionOrderTypeId: entity.productionOrderTypeId,
              customerId: entity.salesOrderDto?.customerId,
              customerOrderNumber:
                entity.customerOrderNumber || entity.salesOrderDto?.customerOrderNumber,
              salesOrderId: entity.salesOrderId,
              salesOrderMaterialId: entity.salesOrderMaterialId,
              materialId: entity.materialDto?.id || entity?.salesOrderMaterialId,
              routingId: entity.routingId,
              initialDate: entity.initialDate ?? undefined,
              finalDelivery: entity.finalDelivery ?? undefined,
              foreseenDeliveryPOOrigin: entity.foreseenDeliveryPOOrigin ?? undefined,
              foreseenDelivery: entity.foreseenDelivery ?? undefined,
              origin: entity.origin,
              factoryDetail: undefined,
              quantity1: entity.quantity1,
              quantity2: entity.quantity2,
              quantity3: entity.quantity3,
              unitOfMeasure1Id: entity.unitOfMeasure1Id,
              unitOfMeasure2Id: entity.unitOfMeasure2Id,
              unitOfMeasure3Id: entity.unitOfMeasure3Id,
              creationDate: dateFormatter(entity?.changeHistoryDto?.createdOn),
              salesOrderDelivery: entity.salesOrderDto?.salesOrderDelivery || undefined,
              remark: '',
              materialGroupId: entity.salesOrderMaterialDto?.material?.materialGroupId,
              articleId: entity.salesOrderMaterialDto?.material?.articleId,
              colorId: entity.salesOrderMaterialDto?.material?.colorId,
              thicknessId: entity.salesOrderMaterialDto?.material?.thicknessId,
              selectionId: entity.salesOrderMaterialDto?.material?.selectionId,
              pO_RoutingOperationAddAndUpdateDtos:
                entity.pO_RoutingOperations.map(routingOperationMapper) ?? [],
              routingAddAndUpdateOperations:
                entity.pO_RoutingOperations.map(routingOperationMapper) ?? [],
            },
      [routingOperationMapper],
    );
  const form = useMaintainForm({
    ns: 'productionOrder',
    validationSchema,
    duplicateErrors,
    mapEntityToFormData,
    state,
    clearEntity: clearProductionOrder,
    readThunk: getProductionOrder,
  });

  return form;
};
