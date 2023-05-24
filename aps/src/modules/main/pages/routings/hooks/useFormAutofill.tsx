/**
 * @module useRouteFormAutofill
 */

import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { useEffect, useMemo } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { getAllOperations } from '../../settings/redux/operations/thunks';
import { RoutingRouteFormData } from '../../settings/redux/routings/interfaces';
/**
 * Prefills {@link RoutesModal} form with values when the selected routing changes or the selected routing's operation changes
 */
export const useFormAutofill = (form: UseFormReturn<RoutingRouteFormData>): void => {
  const { watch, setValue } = form;
  const { operationId: operationId, workCenterId } = watch();
  const { data: operations } = useAppSelector((state) => state.operation);
  const dispatch = useAppDispatch();
  useEffect(() => {
    if (!operations.length) {
      dispatch(getAllOperations());
    }
  }, [dispatch, operations.length]);
  const selectedOperation = useMemo(
    () => operations?.find((o) => o.id === operationId),
    [operationId, operations],
  );

  useEffect(() => {
    if (!selectedOperation) {
      setValue('standardTime', undefined);
      setValue('setupTime', undefined);
      setValue('waitingTime', undefined);
      setValue('remark', '');
      setValue('departmentName', undefined);
      setValue('operationId', undefined);
    }
    if (form.formState.isDirty && selectedOperation) {
      const options = {
        shouldValidate: true,
        shouldDirty: true,
        shouldTouch: true,
      };
      setValue('executedDate', undefined, options);
      setValue('planningDate', undefined, options);
      setValue('workCenterId', workCenterId ?? undefined, options);
      setValue('operationId', operationId, options);
      setValue('operationName', selectedOperation.name ?? '', options);
      setValue('standardTime', selectedOperation.operationTime, options);
      setValue('operationTime', selectedOperation.operationTime, options);
      setValue('setupTime', selectedOperation.setupTime, options);
      setValue('waitingTime', selectedOperation.waitingTime, options);
      setValue('remark', selectedOperation.remark ?? '', options);
      setValue('departmentName', selectedOperation.department?.name ?? '', options);
    }
  }, [form, selectedOperation, setValue, operationId, workCenterId]);
};
