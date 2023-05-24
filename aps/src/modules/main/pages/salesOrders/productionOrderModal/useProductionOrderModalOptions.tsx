/**
 * @module useProductionOrderModalOptions
 */

import { mapDataToOptions } from '@/modules/shared/utils/utils';
import { DefaultOptionType } from 'antd/lib/select';
import { useEffect, useMemo } from 'react';
import { useAppDispatch, useAppSelector } from '../../../../../store/hooks';
import { getAllProductionOrderTypes } from '../../settings/redux/productionOrderTypes/thunks';
import { getAllRoutings } from '../../settings/redux/routings/thunks';

export type UseProductionOrderModalOptionsReturn = {
  orderTypeOptions: DefaultOptionType[];
  routingOptions: DefaultOptionType[];
};
/**
 * Fetches and converts data to options usable by select and radio inputs.
 * @returns An object containing arrays of objects with values and labels
 */
export const useProductionOrderModalOptions = (): UseProductionOrderModalOptionsReturn => {
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(getAllProductionOrderTypes());
    dispatch(getAllRoutings());
  }, [dispatch]);

  const { productionOrderTypes, routings } = useAppSelector((state) => ({
    productionOrderTypes: state.productionOrderTypes.data,
    routings: state.routings.data,
  }));

  const orderTypeOptions: DefaultOptionType[] = useMemo(
    () => mapDataToOptions(productionOrderTypes),
    [productionOrderTypes],
  );

  const routingOptions: DefaultOptionType[] = useMemo(() => mapDataToOptions(routings), [routings]);

  return { orderTypeOptions, routingOptions };
};
