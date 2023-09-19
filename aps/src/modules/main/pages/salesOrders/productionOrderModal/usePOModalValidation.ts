/**
 * @module usePOModalValidation
 */

import { useTranslate } from '@/modules/shared/hooks/translate.hook';
import {
  notificationFail,
  notificationSuccess,
} from '@/modules/shared/services/notification.service';
import { useAppSelector } from '@/store/hooks';
import { useEffect } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { ProductionOrderModalForm } from '../../settings/redux/productionOrders/productionOrdersModal/interfaces';

export type POModalValidationProps = {
  ns: string;
  form: UseFormReturn<ProductionOrderModalForm, any>;
};
/**
 * Validates if requests sent by the production order modal were successful
 * Renders {@link CustomNotification | notifications} to inform the user about the end result.
 */
export const usePOModalValidation = ({ ns, form }: POModalValidationProps): void => {
  const {
    formState: { isSubmitted },
    reset,
  } = form;
  const { translate } = useTranslate({ ns, keyPrefix: 'validation' });
  const { loading, error } = useAppSelector((state) => state.productionOrdersModal);
  useEffect(() => {
    if (!isSubmitted || loading) {
      return;
    }

    if (error) {
      notificationFail(error ? error : translate('create_fail'));
      reset(undefined, {
        keepIsSubmitted: false,
        keepValues: true,
      });
      return;
    }

    notificationSuccess(translate('create_success'));
  }, [error, isSubmitted, loading, reset, translate]);
};
