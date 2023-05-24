/**
 * @module useStatisticsOptions
 */

import { mapDataToOptions } from '@/modules/shared/utils/utils';
import { DefaultOptionType } from 'antd/lib/select';
import { useEffect, useMemo } from 'react';
import { useAppDispatch, useAppSelector } from '../../../../../store/hooks';
import { getAllWorkCenters } from '../../settings/redux/workCenters/thunks';

export type UseProductionCalendarOptionsReturn = {
  workCenterOptions: DefaultOptionType[];
};

export const useStatisticsOptions = (): UseProductionCalendarOptionsReturn => {
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(getAllWorkCenters());
  }, [dispatch]);

  const { workCenters } = useAppSelector((state) => ({
    workCenters: state.workCenter.data,
  }));

  const workCenterOptions: DefaultOptionType[] = useMemo(
    () => mapDataToOptions(workCenters),
    [workCenters],
  );

  return { workCenterOptions };
};
