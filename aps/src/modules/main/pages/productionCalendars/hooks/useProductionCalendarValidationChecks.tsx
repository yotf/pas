/**
 * @module useProductionCalendarValidationChecks
 */

import { EDIT_PAGE, PRODUCTION_CALENDAR_PAGE } from '@/modules/main/consts/pageRouter';
import { useAppSelector } from '@/store/hooks';
import { useEffect } from 'react';
import { useFormContext } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useTranslate } from '../../../../shared/hooks/translate.hook';
import {
  notificationFail,
  notificationSuccess,
} from '../../../../shared/services/notification.service';
/**
 * @param translate Function returned by {@link useTranslate} hook, used for localization.
 * Renders {@link CustomNotification | notifications} to inform the user about the end result of API calls.
 */
export const useProductionCalendarValidationChecks = (ns: string): void => {
  const navigate = useNavigate();
  const {
    formState: { isSubmitted },
    reset,
  } = useFormContext();
  const { translate } = useTranslate({ ns, keyPrefix: 'validation' });
  const { loading, error, productionCalendarIds } = useAppSelector(
    (state) => state.productionCalendarsWorkCapacities,
  );
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
    navigate(`${PRODUCTION_CALENDAR_PAGE}/${EDIT_PAGE}`.replace(':id', productionCalendarIds.join(",")));
  }, [error, isSubmitted, loading, navigate, productionCalendarIds, reset, translate]);
};
