/**
 * @module UseOperationMaintainSetup
 */

import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { useEffect, useState } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { useParams } from 'react-router-dom';
import { useEntityForm } from '../../settings/hooks/entity-form';
import { OperationFormData } from '../../settings/redux/operations/interfaces';
import { clearOperation } from '../../settings/redux/operations/slice';
import { getOperation } from '../../settings/redux/operations/thunks';
import { useOperationFormErrors } from './useOperationFormErrors';
import { useOperationSchema } from './useOperationSchema';

export type UseOperationSetupReturn = {
  form: UseFormReturn<OperationFormData, any>;
  operationForEdit: OperationFormData | undefined;
  isLoaded: boolean;
};
/**
 * @param copy If copy is true values are copied from an already created Material and placed inside the form.
 * Creates a mapping function. Creates a validation schema using {@link UseOperationSchema}.
 * Mentioned values are passed down to {@link UseEntityForm}.
 * @returns A form created by {@link UseEntityForm}.
 */
export const useOperationMaintainSetup = (copy: boolean): UseOperationSetupReturn => {
  const { id } = useParams();
  const dispatch = useAppDispatch();
  const { entity, loading } = useAppSelector((state) => state.operation);
  const [operationForEdit, setOperationForEdit] = useState<OperationFormData>();
  const [isLoaded, setIsLoaded] = useState<boolean>(false);

  useEffect(() => {
    dispatch(getOperation(Number(id ?? 0)));
  }, [dispatch, id]);

  useEffect(() => {
    const OperationData: OperationFormData =
      entity?.id === 0
        ? {
            id: 0,
            name: '',
            operation_Id: 0,
            departmentId: undefined,
            allocationBased: 1,
            isActive: true,
            remark: '',
            unitOfMeasureId: undefined,
            operationTime: '',
            setupTime: '',
            waitingTime: '',
            interfaceCode: '',
          }
        : ({
            departmentId: entity?.departmentId ?? undefined,
            allocationBased: entity?.allocationBased,
            isActive: entity?.isActive,
            remark: entity?.remark,
            unitOfMeasureId: entity?.unitOfMeasureId,
            operationTime: entity?.operationTime,
            setupTime: entity?.setupTime,
            waitingTime: entity?.waitingTime,
            interfaceCode: entity?.interfaceCode,
            name: copy ? '' : entity?.name,
            operation_Id: copy ? 0 : entity?.operation_Id,
            id: copy ? 0 : entity?.id,
          } as OperationFormData);
    setOperationForEdit(OperationData);
  }, [copy, entity]);

  useEffect(() => {
    setIsLoaded(!loading && !!operationForEdit);
  }, [loading, operationForEdit]);

  const validationSchema = useOperationSchema();
  const form = useEntityForm({ entity: operationForEdit!, validationSchema, isOpen: false });
  useOperationFormErrors(form);

  useEffect(() => {
    return () => {
      dispatch(clearOperation());
    };
  }, [dispatch]);

  return { form, operationForEdit, isLoaded };
};
