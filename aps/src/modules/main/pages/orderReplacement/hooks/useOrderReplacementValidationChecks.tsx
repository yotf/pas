/**
 * @module useOrderReplacementValidationChecks
 */

import {
  notificationFail,
  notificationSuccess,
} from '@/modules/shared/services/notification.service';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { useEffect } from 'react';
import { useFormContext } from 'react-hook-form';
//import { clearOrderReplacementData } from '../../settings/redux/orderReplacement/slices';
/**
 * @param translate Function returned by {@link useTranslate} hook, used for localization.
 * Renders {@link CustomNotification | notifications} to inform the user about the end result of API calls.
 */
export const useOrderReplacementValidationChecks = (
  translate: (value: string, options?: Record<string, string> | undefined) => string,
  generateCallback: (replaced: boolean) => void,
  generateSubmitted: boolean,
): void => {
  const {
    formState: { isSubmitted: replaceOrdersSubmitted },
    reset,
  } = useFormContext();
  const dispatch = useAppDispatch();
  const {
    loading: tablesLoading,
    error: tableLoadError,
    data: inOutData,
  } = useAppSelector((state) => state.orderReplacement);
  const { loading: replaceLoading, error: replaceError } = useAppSelector(
    (state) => state.performOrderReplacement,
  );
  useEffect(() => {
    if (!replaceOrdersSubmitted || replaceLoading) {
      return;
    }

    if (replaceError) {
      notificationFail(replaceError);
      reset(undefined, {
        keepIsSubmitted: false,
        keepValues: true,
      });
      return;
    }
    notificationSuccess(translate('replace_success'));
    reset(undefined, {
      keepIsSubmitted: false,
      keepValues: true,
    });
  }, [dispatch, replaceError, replaceOrdersSubmitted, replaceLoading, reset, translate]);

  useEffect(() => {
    if (tablesLoading || !generateSubmitted) return;

    generateCallback(false);
    if (tableLoadError) {
      notificationFail(tableLoadError);
    } else {
      if (inOutData.inProductionOrders.length === 0 && inOutData.outProductionOrders.length === 0) {
        notificationFail(translate('no_POs'));
        return;
      }
      if (inOutData.inProductionOrders.length === 0) {
        notificationFail(translate('no_IN_orders'));
        return;
      }
      if (inOutData.outProductionOrders.length === 0) {
        notificationFail(translate('no_OUT_orders'));
        return;
      }
      notificationSuccess(translate('order_load_success'));
    }
  }, [tableLoadError, tablesLoading, generateSubmitted, translate]);
};
