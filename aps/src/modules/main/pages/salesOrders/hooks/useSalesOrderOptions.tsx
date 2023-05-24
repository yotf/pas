/**
 * @module useSalesOrderOptions
 */

import { mapDataToOptions } from '@/modules/shared/utils/utils';
import { DefaultOptionType } from 'antd/lib/select';
import { useEffect, useMemo } from 'react';
import { useAppDispatch, useAppSelector } from '../../../../../store/hooks';
import { getAllCustomers } from '../../settings/redux/customers/thunks';
import { getAllMaterials } from '../../settings/redux/materials/thunks';
import { getAllOrderTypes } from '../../settings/redux/orderTypes/thunks';

export type UseSalesOrderOptionsType = {
  customerOptions: DefaultOptionType[];
  orderTypeOptions: DefaultOptionType[];
  materialOptions: DefaultOptionType[];
};
/**
 * Fetches and converts data to options usable by select and radio inputs.
 * @returns An object containing arrays of objects with values and labels
 */
export const useSalesOrderOptions = (): UseSalesOrderOptionsType => {
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(getAllCustomers());
    dispatch(getAllOrderTypes());
    dispatch(getAllMaterials());
  }, [dispatch]);

  const { customers, orderTypes, materials } = useAppSelector((state) => ({
    customers: state.customers.data,
    orderTypes: state.orderTypes.data,
    materials: state.materials.data,
  }));

  const customerOptions: DefaultOptionType[] = useMemo(
    () => mapDataToOptions(customers),
    [customers],
  );

  const orderTypeOptions: DefaultOptionType[] = useMemo(
    () => mapDataToOptions(orderTypes),
    [orderTypes],
  );

  const materialOptions: DefaultOptionType[] = useMemo(
    () => mapDataToOptions(materials),
    [materials],
  );

  return { customerOptions, orderTypeOptions, materialOptions };
};
