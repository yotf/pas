/**
 * @module useRoutingRouteForm
 */

import { useGeneratedSequence } from '@/modules/shared/hooks/useGeneratedSequence.hook';
import { yupResolver } from '@hookform/resolvers/yup';
import { useCallback, useMemo } from 'react';
import { UseFormReturn, useForm, useFormContext } from 'react-hook-form';
import { RoutingFormData, RoutingRouteFormData } from '../../settings/redux/routings/interfaces';
import { useFormAutofill } from './useFormAutofill';
import { useRoutingRouteSchema } from './useRoutingRouteSchema';
import { executeProductionOrderOperation } from '../../settings/redux/productionOrders/productionOrderExecute/thunks';
import { useAppDispatch } from '@/store/hooks';

export type Props = {
  route?: RoutingRouteFormData;
  onClose: () => void;
  option?: 'create' | 'edit' | 'execute';
  linkedPOId?: number;
  executeOperationCallback?: () => void;
};

export type Return = {
  form: UseFormReturn<RoutingRouteFormData>;
  onSubmit: () => void;
};
/**
 *
 * @param route Route selected by user when clicking triggering the on edit function in the {@link RoutesTable} component.
 * @param option Defines if a new route is created or an existing one is being edited
 * @param onClose Clears selected routing route and closes the modal
 * @returns Routing Route form used in {@link RoutesModal}. The form recalculates routes from the main form and their sequences. When on submit is triggered the main form gets updated.
 */
export const useRoutingRouteForm = ({
  route,
  onClose,
  option,
  linkedPOId,
  executeOperationCallback,
}: Props): Return => {
  const { watch, setValue, getValues } = useFormContext<RoutingFormData>();
  const { routingAddAndUpdateOperations } = watch();
  const setMaxSequence =
    !!routingAddAndUpdateOperations && option === 'edit'
      ? routingAddAndUpdateOperations.length - 1
      : routingAddAndUpdateOperations?.length;
  const isPlannedPO = option === 'execute';
  const validationSchema = useRoutingRouteSchema(setMaxSequence ?? 0, isPlannedPO);
  const form = useForm<RoutingRouteFormData>({
    resolver: yupResolver(validationSchema),
    mode: 'onBlur',
  });
  useFormAutofill(form);
  useGeneratedSequence(route!, form, 'routingAddAndUpdateOperations');

  const dispatch = useAppDispatch();

  const recalculateOperations = useCallback(
    (data: RoutingRouteFormData): RoutingRouteFormData[] => {
      let { routingAddAndUpdateOperations: routingOperations = [] } = getValues();
      routingOperations = routingOperations.slice();
      if (route?.sequence !== undefined) {
        const routeIndex = route!.sequence! - 1;
        routingOperations.splice(routeIndex, 1);
      }

      const routeIndex = data.sequence! - 1;
      const laterOps = routingOperations.slice(routeIndex);

      routingOperations = routingOperations.slice(0, routeIndex);
      routingOperations.push(data);
      routingOperations.push(...laterOps);
      return routingOperations;
    },
    [getValues, route],
  );

  const { handleSubmit } = form;
  const onSubmitSave = useMemo(
    () =>
      handleSubmit((data: RoutingRouteFormData) => {
        const routingOperations = recalculateOperations(data);
        setValue('routingAddAndUpdateOperations', routingOperations, {
          shouldDirty: true,
          shouldTouch: true,
          shouldValidate: true,
        });
        onClose();
      }),
    [handleSubmit, onClose, recalculateOperations, setValue],
  );

  const onSubmitExecute = useMemo(
    () =>
      handleSubmit((data: RoutingRouteFormData) => {
        debugger;
        dispatch(
          executeProductionOrderOperation({
            id: data.id!,
            linkedPOId,
            executionDate: data.executedDate!,
            skipped: data.skipped!,
          }),
        );
        if (executeOperationCallback) executeOperationCallback();
        onClose();
      }),
    [handleSubmit, onClose, recalculateOperations, setValue, linkedPOId],
  );

  const onSubmit = option === 'execute' ? onSubmitExecute : onSubmitSave;

  return { form, onSubmit };
};
