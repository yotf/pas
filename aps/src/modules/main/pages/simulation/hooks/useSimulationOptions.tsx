/**
 * @module useSimulationOptions
 */

import { mapDataToOptions } from '@/modules/shared/utils/utils';
import { DefaultOptionType } from 'antd/lib/select';
import { useEffect, useMemo } from 'react';
import { useAppDispatch, useAppSelector } from '../../../../../store/hooks';
import { getAllRoutings } from '../../settings/redux/routings/thunks';

export type UseSimulationOptionsReturn = {
  routingOptions: DefaultOptionType[];
};
/**
 * Fetches and converts data to options usable by select and radio inputs.
 * @returns An object containing arrays of objects with values and labels.
 */
export const useSimulationOptions = (): UseSimulationOptionsReturn => {
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(getAllRoutings());
  }, [dispatch]);

  const { routings } = useAppSelector((state) => ({
    routings: state.routings.data,
  }));

  const routingOptions: DefaultOptionType[] = useMemo(() => mapDataToOptions(routings), [routings]);

  return { routingOptions };
};
