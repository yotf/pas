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
    setInnerFormValue(
      'allocatedMinutes',
      (data?.allocatedMinutes &&
        Number(data?.allocatedMinutes)?.toLocaleString('en', { useGrouping: true })) ??
        '',
    );
    setInnerFormValue(
      'availableMinutes',
      (data?.availableMinutes &&
        Number(data?.availableMinutes)?.toLocaleString('en', { useGrouping: true })) ??
        '',
    );
    setInnerFormValue(
      'delayedPO',
      (data?.delayedPO && Number(data?.delayedPO)?.toLocaleString('en', { useGrouping: true })) ??
        '',
    );
    setInnerFormValue(
      'numberOfPO',
      (data?.numberOfPO && Number(data?.numberOfPO)?.toLocaleString('en', { useGrouping: true })) ??
        '',
    );
    setInnerFormValue(
      'numberOfSalesOrders',
      (data?.numberOfSalesOrders &&
        Number(data?.numberOfSalesOrders)?.toLocaleString('en', { useGrouping: true })) ??
        '',
    );
    setInnerFormValue(
      'occupancy',
      (data?.occupancy && Number(data?.occupancy)?.toLocaleString('en', { useGrouping: true })) ??
        '',
    );
    setInnerFormValue(
      'setupMinutes',
      (data?.setupMinutes &&
        Number(data?.setupMinutes)?.toLocaleString('en', { useGrouping: true })) ??
        '',
    );
    setInnerFormValue(
      'delayedSalesOrders',
      (data?.delayedSalesOrders &&
        Number(data?.delayedSalesOrders)?.toLocaleString('en', { useGrouping: true })) ??
        '',
    );
  }, [data, setInnerFormValue]);

  return { form, innerForm };
};
