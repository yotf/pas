/**
 * @module useRoutingOptions
 */

import { mapDataToOptions } from '@/modules/shared/utils/utils';
import { DefaultOptionType } from 'antd/lib/select';
import { useCallback, useEffect, useMemo } from 'react';
import { useAppDispatch, useAppSelector } from '../../../../../store/hooks';
import { getAllCustomers } from '../../settings/redux/customers/thunks';
import { getAllMaterials } from '../../settings/redux/materials/thunks';
import { getAllUnitsOfMeasure } from '../../settings/redux/unitOfMeasure/thunks';
import { getConfiguration } from '../../settings/redux/configuration/thunks';
import { SettingsPageItem } from '../../settings/consts/interfaces';
import { AllocationBased } from '../../settings/redux/operations/interfaces';
import { useTranslate } from '@/modules/shared/hooks/translate.hook';

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
  const { translate: translateAllocation } = useTranslate({ ns: 'allocation_labels' });

  const convertForDropdown = useCallback(
    (arr: SettingsPageItem[] | undefined): DefaultOptionType[] => {
      if (arr === undefined) return [];
      return arr.map((item) => {
        return { label: item.name, value: item.id };
      });
    },
    [],
  );
  useEffect(() => {
    dispatch(getAllUnitsOfMeasure());
    dispatch(getAllMaterials());
    dispatch(getAllCustomers());
    dispatch(getConfiguration());
  }, [dispatch]);

  const { unitOfMeasures, materials, customers } = useAppSelector((state) => ({
    unitOfMeasures: state.unitOfMeasure.data,
    materials: state.materials.data,
    customers: state.customers.data,
  }));

  const { quantities1 } = useAppSelector((state) => state.configuration.data);

  const unitOptions: DefaultOptionType[] = useMemo(
    () => convertForDropdown(quantities1.map((q1) => q1.unitOfMeasure)),
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
