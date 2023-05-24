/**
 * @module useStatisticsForm
 */

import { useAppSelector } from '@/store/hooks';
import { yupResolver } from '@hookform/resolvers/yup';
import { useEffect } from 'react';
import { useForm, UseFormReturn } from 'react-hook-form';
import { useLocation } from 'react-router-dom';
import {
  StatisticsFormData,
  StatisticsGeneratedData,
} from '../../settings/redux/statistics/interfaces';
import { useStatisticsSchema } from './useStatisticsSchema';

export type StatisticsFormsReturn = {
  form: UseFormReturn<StatisticsFormData, any>;
  innerForm: UseFormReturn<StatisticsGeneratedData, any>;
};

export const useStatisticsForms = (): StatisticsFormsReturn => {
  const location = useLocation();
  const { data } = useAppSelector((state) => state.statistics);

  const validationSchema = useStatisticsSchema();
  const form = useForm<StatisticsFormData>({
    resolver: yupResolver(validationSchema),
    mode: 'onBlur',
  });

  const { setValue, trigger } = form;

  const innerForm = useForm<StatisticsGeneratedData>();

  const { setValue: setInnerFormValue } = innerForm;

  useEffect(() => {
    if (data) {
      setInnerFormValue('allocatedMinutes', data.allocatedMinutes);
      setInnerFormValue('availableMinutes', data.availableMinutes);
      setInnerFormValue('delayedPO', data.delayedPO);
      setInnerFormValue('numberOfPO', data.numberOfPO);
      setInnerFormValue('numberOfSalesOrders', data.numberOfSalesOrders);
      setInnerFormValue('occupancy', data.occupancy);
      setInnerFormValue('setupMinutes', data.setupMinutes);
      setInnerFormValue('delayedSalesOrders', data.delayedSalesOrders);
    }
  }, [data, setInnerFormValue]);

  useEffect(() => {
    if (location.state) {
      setValue('initialDate', location.state.initialDate);
      setValue('finalDate', location.state.finalDate);
      setValue('workCenters', location.state.workCenters);
      trigger();
    }
  }, [location, setValue, trigger]);

  return { form, innerForm };
};
