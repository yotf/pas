/**
 * @module useReallocationOfPlanningValidation
 */

import { useTranslate } from '@/modules/shared/hooks/translate.hook';
import {
  notificationFail,
  notificationSuccess,
} from '@/modules/shared/services/notification.service';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { useContext, useEffect } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { ReallocationOfPlanningForm } from '../../../settings/redux/overview/reallocationOfPlanning/interfaces';
import { OverviewContext, OverviewContextValue } from '../../context/overview.context';
import { getProductionOrder } from '../../../settings/redux/productionOrders/thunks';
/**
 *
 * @param form React hook form from {@link useReallocationOfPlanningModal}
 * Validates requests related to Reallocation of planning modal
 */
export const useReallocationValidation = (
  form: UseFormReturn<ReallocationOfPlanningForm>,
  closeModalCallback: () => void,
  selectedPOId: number,
  reallocationOKCallback: () => void,
  reallocationSubmitted: boolean,
): void => {
  const { overviewFormData } = useContext<OverviewContextValue>(OverviewContext);

  const {
    formState: { isSubmitted },
    reset,
  } = form;

  const { translate } = useTranslate({ ns: 'reallocationOfPlanning', keyPrefix: 'validation' });

  const { loading, error } = useAppSelector((state) => state.overview);
  const { loading: loadingReallocation, error: reallocationError } = useAppSelector(
    (state) => state.reallocationOfPlanning,
  );

  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!isSubmitted || loading) {
      return;
    }

    if (error !== 'Rejected') {
      notificationFail(translate('unschedule_fail'));
    }

    if (error) {
      reset(undefined, {
        keepIsSubmitted: false,
        keepValues: true,
      });

      return;
    }

    notificationSuccess(translate('schedule_success'));
    reset(undefined, {
      keepIsSubmitted: false,
      keepValues: true,
    });
    closeModalCallback();
  }, [dispatch, error, isSubmitted, loading, overviewFormData, reset, translate]);

  useEffect(() => {
    if (!reallocationSubmitted || loadingReallocation) {
      return;
    }

    if (reallocationError) {
      notificationFail(translate('reallocation_fail'));
      return;
    }
    notificationSuccess(translate('reallocation_success'));
    dispatch(getProductionOrder(selectedPOId));
    reallocationOKCallback();
  }, [dispatch, error, loadingReallocation, selectedPOId, translate]);
};
