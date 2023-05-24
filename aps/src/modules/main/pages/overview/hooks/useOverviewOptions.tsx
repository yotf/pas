/**
 * @module useOverviewOptions
 */

import { mapDataToOptions } from '@/modules/shared/utils/utils';
import { DefaultOptionType } from 'antd/lib/select';
import { useEffect, useMemo } from 'react';
import { useAppDispatch, useAppSelector } from '../../../../../store/hooks';
import { getAllOrderTypes } from '../../settings/redux/orderTypes/thunks';
import { getAllWorkCenters } from '../../settings/redux/workCenters/thunks';

export type UseProductionCalendarOptionsReturn = {
  orderTypeOptions: DefaultOptionType[];
  workCenterOptions: DefaultOptionType[];
};
/**
 * Fetches and converts data to options usable by select and radio inputs.
 * @returns An object containing arrays of objects with values and labels
 */
export const useOverviewOptions = (): UseProductionCalendarOptionsReturn => {
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(getAllWorkCenters());
    dispatch(getAllOrderTypes());
  }, [dispatch]);

  const { workCenters, orderTypes } = useAppSelector((state) => ({
    orderTypes: state.orderTypes.data,
    workCenters: state.workCenter.data,
  }));

  const workCenterOptions: DefaultOptionType[] = useMemo(
    () => mapDataToOptions(workCenters),
    [workCenters],
  );

  const orderTypeOptions: DefaultOptionType[] = useMemo(
    () => mapDataToOptions(orderTypes),
    [orderTypes],
  );

  return { orderTypeOptions, workCenterOptions };
};
