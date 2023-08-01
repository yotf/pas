/**
 * @module useWorkCenterMaintainSetup
 */

import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { useEffect, useMemo, useState } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { useParams } from 'react-router-dom';
import { useEntityForm } from '../../settings/hooks/entity-form';
import { AllowedOperation } from '../../settings/redux/allowedOperations/interfaces';
import { WorkCapacity } from '../../settings/redux/workcenterCapacities/interfaces';
import { WorkCenterFormData } from '../../settings/redux/workCenters/interfaces';
import { clearWorkCenter } from '../../settings/redux/workCenters/slice';
import { getWorkCenter } from '../../settings/redux/workCenters/thunks';
import { useWorkCenterFormErrors } from './useWorkCenterFormErrors';
import { useWorkCenterSchema } from './useWorkCenterSchema';

export type UseWorkCenterMaintainSetupReturn = {
  form: UseFormReturn<WorkCenterFormData, any>;
  workCenterForEdit: WorkCenterFormData | undefined;
  isLoaded: boolean;
};
/**
 * @param copy If copy is true values are copied from an already created Material and placed inside the form.
 * Creates a mapping function. Creates a validation schema using {@link useWorkCenterSchema}.
 * Mentioned values are passed down to {@link UseEntityForm}.
 * @returns A form created by {@link UseEntityForm}.
 */
export const useWorkCenterMaintainSetup = (
  copy: boolean,
  isFormulaSelected: boolean,
): UseWorkCenterMaintainSetupReturn => {
  const { id } = useParams();
  const dispatch = useAppDispatch();
  const { entity, loading } = useAppSelector((state) => state.workCenter);
  const [workCenterForEdit, setWorkCenterForEdit] = useState<WorkCenterFormData>();
  const [isLoaded, setIsLoaded] = useState<boolean>(false);

  useEffect(() => {
    dispatch(getWorkCenter(Number(id ?? 0)));
  }, [dispatch, id]);

  const formatWorkCapacities = (arr: WorkCapacity[]): WorkCapacity[] => {
    return arr.map((el: WorkCapacity): WorkCapacity => {
      return { ...el, start: '', end: '' };
    });
  };
  useEffect(() => {
    const WorkCenterData: WorkCenterFormData =
      entity?.id === 0
        ? {
            id: 0,
            name: '',
            departmentId: undefined,
            allocationBased: 1,
            isActive: true,
            remark: '',
            workCenter_Id: 0,
            unitOfMeasureId: undefined,
            workCenterInterfaceId: '',
            workCapacities: formatWorkCapacities(entity.workCapacities),
            allowedOperations: [],
            workCenterAddAndUpdateDto: [],
          }
        : ({
            id: copy ? 0 : entity?.id,
            name: copy ? '' : entity?.name,
            departmentId: entity?.departmentId ?? undefined,
            allocationBased: entity?.allocationBased,
            isActive: entity?.isActive,
            remark: entity?.remark,
            workCenter_Id: copy ? 0 : entity?.workCenter_Id,
            unitOfMeasureId: entity?.unitOfMeasureId ?? undefined,
            workCenterInterfaceId: entity?.workCenterInterfaceId ?? undefined,
            workCapacities: copy
              ? entity?.workCapacities.map((wc: WorkCapacity) => ({ ...wc, id: 0 }))
              : entity?.workCapacities,
            allowedOperations: copy
              ? entity?.allowedOperations.map((ao: AllowedOperation) => ({ ...ao, id: 0 })) ?? []
              : entity?.allowedOperations ?? [],
            workCenterAddAndUpdateDto: entity?.workCenterAddAndUpdateDto ?? [],
            weightCapacity: entity?.weightCapacity,
          } as WorkCenterFormData);
    setWorkCenterForEdit(WorkCenterData);
  }, [copy, entity]);

  useEffect(() => {
    setIsLoaded(!loading && !!workCenterForEdit);
  }, [loading, workCenterForEdit]);

  const validationSchema = useWorkCenterSchema(isFormulaSelected);
  const form = useEntityForm({ entity: workCenterForEdit!, validationSchema, isOpen: false });
  useWorkCenterFormErrors(form);

  useEffect(() => {
    return () => {
      dispatch(clearWorkCenter());
    };
  }, [dispatch]);

  return { form, workCenterForEdit, isLoaded };
};
