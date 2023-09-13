/**
 * @module useProductionCalendarOptions
 */

import { mapDataToOptions } from '@/modules/shared/utils/utils';
import { DefaultOptionType } from 'antd/lib/select';
import { useEffect, useMemo } from 'react';
import { useAppDispatch, useAppSelector } from '../../../../../store/hooks';
import { getAllWorkCenters } from '../../settings/redux/workCenters/thunks';

import { ProductionCalendarPostResponse } from '../../settings/redux/productionCalendarsWorkCapacities/interfaces';

export type UseProductionCalendarOptionsReturn = {
  workCenterOptions: DefaultOptionType[];
};
/**
 * Fetches and converts data to options usable by select and radio inputs.
 * @returns An object containing arrays of objects with values and labels
 */
export const useProductionCalendarOptions = (
  entity?: ProductionCalendarPostResponse[],
): UseProductionCalendarOptionsReturn => {
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(getAllWorkCenters());
  }, [dispatch]);

  const { workCenters } = useAppSelector((state) => ({
    workCenters: state.workCenter.data,
  }));

  const alreadySelected = entity?.[0].productionCalendarBaseInfoDto.workCenter;

  const workCenterOptions: DefaultOptionType[] = useMemo(
    () =>
      mapDataToOptions(
        workCenters,
        alreadySelected ? { value: alreadySelected.id, label: alreadySelected.name } : undefined,
      ).sort((a, b) => {
        if (!(a?.label && b?.label)) return 0;
        if (a.label < b.label) {
          return -1;
        }
        if (a.label > b.label) {
          return 1;
        }
        return 0;
      }),
    [workCenters, alreadySelected],
  );

  return { workCenterOptions };
};
