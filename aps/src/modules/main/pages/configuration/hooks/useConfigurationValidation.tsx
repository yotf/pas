import { UseFormReturn } from 'react-hook-form';
import { ConfigurationFormData } from '../interfaces';
import { useTranslate } from '@/modules/shared/hooks/translate.hook';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { useEffect } from 'react';
import {
  notificationFail,
  notificationSuccess,
} from '@/modules/shared/services/notification.service';
import { getConfiguration } from '../../settings/redux/configuration/thunks';
export type ConfigurationValidationProps = {
  ns: string;
  form: UseFormReturn<ConfigurationFormData, any>;
};
export const useConfigurationValidation = ({ ns, form }: ConfigurationValidationProps): void => {
  const {
    formState: { isSubmitted },
    reset,
  } = form;
  const { translate } = useTranslate({ ns, keyPrefix: 'validation' });
  const { loading, error } = useAppSelector((state) => state.configuration);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!isSubmitted || loading) return;
    if (error) {
      notificationFail(translate('create_fail'));
      reset(undefined, { keepIsSubmitted: false, keepValues: true });
      return;
    }
    notificationSuccess(translate('create_success'));
    dispatch(getConfiguration()); 
  }, [error, loading, isSubmitted, reset, translate]);
};
