/**
 * @module useRoutingOptions
 */

import { mapDataToOptions } from '@/modules/shared/utils/utils';
import { DefaultOptionType } from 'antd/lib/select';
import { useEffect, useMemo } from 'react';
import { useAppDispatch, useAppSelector } from '../../../../../store/hooks';
import { getAllCustomers } from '../../settings/redux/customers/thunks';
import { getAllMaterials } from '../../settings/redux/materials/thunks';
import { getAllUnitsOfMeasure } from '../../settings/redux/unitOfMeasure/thunks';

export type UseRoutingSetupReturnType = {
  unitOptions: DefaultOptionType[];
  materialOptions: DefaultOptionType[];
  customerOptions: DefaultOptionType[];
};
/**
 * Fetches and converts data to options usable by select and radio inputs.
 * @returns An object containing arrays of objects with values and labels
 */
export const useRoutingOptions = (): UseRoutingSetupReturnType => {
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(getAllUnitsOfMeasure());
    dispatch(getAllMaterials());
    dispatch(getAllCustomers());
  }, [dispatch]);

  const { unitOfMeasures, materials, customers } = useAppSelector((state) => ({
    unitOfMeasures: state.unitOfMeasure.data,
    materials: state.materials.data,
    customers: state.customers.data,
  }));

  const unitOptions: DefaultOptionType[] = useMemo(
    () => mapDataToOptions(unitOfMeasures),
    [unitOfMeasures],
  );
  const materialOptions: DefaultOptionType[] = useMemo(
    () => mapDataToOptions(materials),
    [materials],
  );
  const customerOptions: DefaultOptionType[] = useMemo(
    () => mapDataToOptions(customers),
    [customers],
  );

  return { unitOptions, materialOptions, customerOptions };
};
