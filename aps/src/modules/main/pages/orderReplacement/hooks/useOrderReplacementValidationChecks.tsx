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
import { clearOrderReplacementData } from '../../settings/redux/orderReplacement/slices';
/**
 * @param translate Function returned by {@link useTranslate} hook, used for localization.
 * Renders {@link CustomNotification | notifications} to inform the user about the end result of API calls.
 */
export const useOrderReplacementValidationChecks = (
  translate: (value: string, options?: Record<string, string> | undefined) => string,
): void => {
  const {
    formState: { isSubmitted },
    reset,
  } = useFormContext();
  const dispatch = useAppDispatch();
  const { loading, error } = useAppSelector((state) => state.orderReplacement);
  useEffect(() => {
    if (!isSubmitted || loading) {
      return;
    }

    if (error) {
      notificationFail(translate('create_fail'));
      reset(undefined, {
        keepIsSubmitted: false,
        keepValues: true,
      });
      return;
    }
    notificationSuccess(translate('create_success'));
    reset(undefined, {
      keepIsSubmitted: false,
      keepValues: true,
    });
  }, [dispatch, error, isSubmitted, loading, reset, translate]);
};
