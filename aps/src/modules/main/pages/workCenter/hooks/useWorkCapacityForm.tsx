/**
 * @module useWorkCapacityForm
 */

import { yupResolver } from '@hookform/resolvers/yup';
import { useCallback, useMemo } from 'react';
import { useForm, useFormContext, UseFormReturn } from 'react-hook-form';
import {
  WorkCapacity,
  WorkCapacityMapped,
} from '../../settings/redux/workcenterCapacities/interfaces';
import { WorkCenterFormData } from '../../settings/redux/workCenters/interfaces';
import { useWorkCapacityFormAutofill } from './useFormAutofill';
import { useWorkCapacitiesSchema } from './useWorkCapacitieSchema';

export type Props = {
  workCapacity?: WorkCapacityMapped;
  onClose: () => void;
};

export type Return = {
  form: UseFormReturn<WorkCapacityMapped>;
  onSubmit: () => void;
};
/**
 *
 * @param workCapacity Selected work capacity for editing
 * @param onClose Clears selected work capacity and closes {@link WorkCapacityModal}
 * Handles work capacity changes inside the main form. Replaces and existing work capacity with values the user entered
 */
export const useWorkCapacityForm = ({ workCapacity, onClose }: Props): Return => {
  const { watch, setValue } = useFormContext<WorkCenterFormData>();
  const { workCapacities } = watch();
  const validationSchema = useWorkCapacitiesSchema();
  const form = useForm<WorkCapacityMapped>({
    resolver: yupResolver(validationSchema),
    mode: 'onBlur',
  });

  useWorkCapacityFormAutofill(form, workCapacity?.dayOfWeek);

  const editWorkCapacity = useCallback(
    (data: WorkCapacityMapped) => {
      const capacities = workCapacities?.slice();
      const workCapacityIndex = capacities?.findIndex((wc) => wc.dayOfWeek === data.dayOfWeek);
      capacities?.splice(workCapacityIndex!, 1, data as WorkCapacity);
      return capacities;
    },
    [workCapacities],
  );

  const { handleSubmit } = form;
  const onSubmit = useMemo(
    () =>
      handleSubmit((data: WorkCapacityMapped) => {
        const workCapacitiesEdited = editWorkCapacity(data);
        setValue('workCapacities', workCapacitiesEdited, {
          shouldDirty: true,
          shouldTouch: true,
          shouldValidate: true,
        });
        onClose();
      }),
    [handleSubmit, onClose, setValue, editWorkCapacity],
  );

  return { form, onSubmit };
};
