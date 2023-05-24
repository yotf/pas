/**
 * @module useWorkCapacityFormAutofill
 */

import { timeFormat } from '@/modules/shared/consts';
import dayjs from 'dayjs';
import { useEffect, useMemo } from 'react';
import { useFormContext, UseFormReturn } from 'react-hook-form';
import { WorkCapacityMapped } from '../../settings/redux/workcenterCapacities/interfaces';
import { WorkCenterFormData } from '../../settings/redux/workCenters/interfaces';
/**
 * Prefills {@link WorkCapacityModal} form values and recalculates minutes and available minutes.
 */
export const useWorkCapacityFormAutofill = (
  form: UseFormReturn<WorkCapacityMapped>,
  dayOfWeek: number | undefined,
): void => {
  const { reset } = form;

  const { watch } = useFormContext<WorkCenterFormData>();

  const { workCapacities } = watch();
  const selectedWorkCapacity = useMemo(
    () => workCapacities?.find((o) => o.dayOfWeek === dayOfWeek),
    [workCapacities, dayOfWeek],
  );

  const calcMinutes = (start: string, end: string, breakTime: number): number => {
    return dayjs(end, timeFormat).diff(dayjs(start, timeFormat), 'minute') - breakTime ?? 0;
  };

  const calcAvailableMinutes = (
    start: string,
    end: string,
    breakTime: number,
    efficiency: number,
  ): number => {
    if (!start || !end || !efficiency) return 0;
    const minutes = calcMinutes(start, end, breakTime);
    const availableMinutes = minutes * (efficiency / 100);
    return Math.round(availableMinutes);
  };

  const calculateAvailableMinutes = useMemo((): number => {
    if (!selectedWorkCapacity) return 0;
    const { start, end, break: breakTime, efficiency } = selectedWorkCapacity!;
    return calcAvailableMinutes(start, end, breakTime, efficiency);
  }, [selectedWorkCapacity]);

  const calculateMinutes = useMemo((): number => {
    if (!selectedWorkCapacity) return 0;
    const { start, end, break: breakTime } = selectedWorkCapacity!;
    return calcMinutes(start, end, breakTime);
  }, [selectedWorkCapacity]);

  useEffect(() => {
    if (selectedWorkCapacity) {
      reset({
        ...selectedWorkCapacity,
        minutes: calculateMinutes,
        availableMinutes: calculateAvailableMinutes,
      });
    }
  }, [reset, selectedWorkCapacity, calculateAvailableMinutes, calculateMinutes]);
};
