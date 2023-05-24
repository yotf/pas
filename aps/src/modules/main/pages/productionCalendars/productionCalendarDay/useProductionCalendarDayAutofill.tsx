/**
 * @module useProductionCalendarDayAutofill
 */

import { timeFormat } from '@/modules/shared/consts';
import dayjs from 'dayjs';
import { useEffect, useMemo } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { ProductionCalendarDayMapped } from '../../settings/redux/productionCalendarsWorkCapacities/interfaces';
/**
 * Prefills {@link ProductionCalendarDayModal} form with values.
 */
export const useProductionCalendarDayAutofill = (
  form: UseFormReturn<ProductionCalendarDayMapped>,
  selectedProductionCalendarDay: ProductionCalendarDayMapped,
): void => {
  const { reset, setValue } = form;

  const { start, end, break: breakTime, efficiency, capacity } = form.watch();

  const calcMinutes = useMemo(() => {
    return (
      (breakTime && dayjs(end, timeFormat).diff(dayjs(start, timeFormat), 'minute') - breakTime) ??
      undefined
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [start, end]);

  const calcAvailableMinutes = useMemo(() => {
    if (!start || !end || !efficiency) return 0;
    const minutes = calcMinutes;
    const availableMinutes = minutes && minutes * (efficiency / 100);
    return availableMinutes ? Math.round(availableMinutes) : undefined;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [calcMinutes, start, end]);

  useEffect(() => {
    setValue('break', breakTime);
    setValue('efficiency', efficiency);
    setValue('capacity', capacity);
  }, [breakTime, capacity, efficiency, end, setValue, start]);

  useEffect(() => {
    if (selectedProductionCalendarDay) {
      reset({
        ...selectedProductionCalendarDay,
        minutes: calcMinutes,
        availableMinutes: calcAvailableMinutes,
      });
    }
  }, [reset, selectedProductionCalendarDay, calcMinutes, calcAvailableMinutes]);
};
