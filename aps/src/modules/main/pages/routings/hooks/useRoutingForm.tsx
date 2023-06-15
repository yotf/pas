/**
 * @module useRoutingForm
 */

import { useCallback, useEffect, useMemo } from 'react';
import { Path, UseFormReturn } from 'react-hook-form';
import { v4 as uuid } from 'uuid';
import { useMaintainForm } from '../../../components/maintain/hooks/useMaintainForm';
import {
  RoutingFormData,
  RoutingResponse,
  RoutingsResponse,
} from '../../settings/redux/routings/interfaces';
import { clearRouting } from '../../settings/redux/routings/slice';
import { getRouting } from '../../settings/redux/routings/thunks';
import { useRoutingSchema } from './useRoutingSchema';

export type UseRoutingSetupPropsType = {
  copy?: boolean;
  state: RoutingsResponse;
};
/**
 * @param copy If copy is true values are copied from an already created Material and placed inside the form.
 * Creates a mapping function and a indicates which fields cannot be duplicated. Creates a validation schema using {@link useRoutingSchema}.
 * Mentioned values are passed down to {@link useMaintainForm}.
 * @returns A form created by {@link useMaintainForm}.
 */
export const useRoutingForm = ({
  copy,
  state,
}: UseRoutingSetupPropsType): UseFormReturn<RoutingFormData, any> => {
  const validationSchema = useRoutingSchema();
  const duplicateErrors: Record<string, Path<RoutingFormData>> = useMemo(
    () => ({
      DuplicateRoutingName: 'name',
    }),
    [],
  );

  const mapEntityToFormData: (entity?: RoutingResponse) => RoutingFormData = useCallback(
    (entity) =>
      !entity || entity?.id === 0
        ? {
            id: 0,
            routing_Id: 0,
            name: '',
            isActive: true,
            routingInterfaceId: '',
            remark: '',
            routingAddAndUpdateOperations: [],
          }
        : {
            id: copy ? 0 : entity.id || 0,
            name: copy ? '' : entity.name || '',
            routing_Id: copy ? 0 : entity.routing_Id || 0,

            isActive: entity.isActive,
            remark: entity?.remark,
            lotStandardQuantity: entity?.lotStandardQuantity,

            unitOfMeasureId: entity.unitOfMeasure?.code,
            materialId: entity.material?.id,
            customerId: entity?.customer?.id,
            routingInterfaceId: entity?.routingInterfaceId,

            routingAddAndUpdateOperations:
              entity.routingOperations?.map(({ operation, ...rest }, i) => ({
                ...rest,
                guid: uuid(),
                operationName: operation.name,
                departmentName: operation.department?.name,
                id: copy ? 0 : rest.id,
                sequence: i + 1,
              })) ?? [],
          },
    [copy],
  );
  const form = useMaintainForm({
    ns: 'routings',
    validationSchema,
    duplicateErrors,
    mapEntityToFormData,
    state,
    clearEntity: clearRouting,
    readThunk: getRouting,
  });

  const { setValue, watch } = form;
  const { routingAddAndUpdateOperations } = watch();

  useEffect(() => {
    debugger;
    routingAddAndUpdateOperations?.forEach((o, i) => (o.sequence = i + 1));
    setValue('routingAddAndUpdateOperations', routingAddAndUpdateOperations);
  }, [JSON.stringify(routingAddAndUpdateOperations), setValue]);

  return form;
};
