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
import { ReallocationOfPlanningForm } from '../../../settings/redux/reallocationOfPlanning/interfaces';
import { OverviewContext, OverviewContextValue } from '../../context/overview.context';
import { getAllProductionOrders } from '../../../settings/redux/productionOrders/thunks';
import { getAllOverviewCenters } from '../../../settings/redux/overview/thunks';

import { ProductionOrder } from '../../../settings/redux/productionOrders/interfaces';
/**
 *
 * @param form React hook form from {@link useReallocationOfPlanningModal}
 * Validates requests related to Reallocation of planning modal
 */
export const useReallocationValidation = (
  form: UseFormReturn<ReallocationOfPlanningForm>,
  closeModalCallback: () => void,
): void => {
  const { overviewFormData } = useContext<OverviewContextValue>(OverviewContext);

  const {
    formState: { isSubmitted },
    reset,
  } = form;

  const { translate } = useTranslate({ ns: 'reallocationOfPlanning', keyPrefix: 'validation' });

  const { loading, error } = useAppSelector((state) => state.reallocationOfPlanning);

  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!isSubmitted || loading) {
      return;
    }

    if (error !== 'Rejected') {
      notificationFail(translate('reallocation_fail'));
    }

    if (error) {
      reset(undefined, {
        keepIsSubmitted: false,
        keepValues: true,
      });

      return;
    }

    notificationSuccess(translate('reallocation_success'));
    reset(undefined, {
      keepIsSubmitted: false,
      keepValues: true,
    });
    // dispatch(getAllProductionOrders());
    dispatch(getAllOverviewCenters(overviewFormData));
    closeModalCallback();
  }, [dispatch, error, isSubmitted, loading, overviewFormData, reset, translate]);
};
