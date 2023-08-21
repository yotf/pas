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

  // useEffect(() => {
  //   setValue('break', breakTime);
  //   setValue('efficiency', efficiency);
  //   setValue('capacity', capacity);
  // }, [breakTime, capacity, efficiency, end, setValue, start]);

  useEffect(() => {
    if (selectedProductionCalendarDay) {
      reset({
        ...selectedProductionCalendarDay,
      });
    }
  }, [reset, selectedProductionCalendarDay]);
};
