import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { useEffect, useMemo } from 'react';
import { getAllUnitsOfMeasure } from '../../settings/redux/unitOfMeasure/thunks';
import { DefaultOptionType } from 'antd/es/select';

import { ConfigurationFormData } from '../interfaces';
import { ConfigurationResponse } from '../../settings/redux/configuration/states';
import { Configuration } from '../../settings/redux/configuration/interfaces';
import { IdentifiableEntity } from '../../settings/redux/thunks';

export const useConfigurationOptions = (sliceState: Configuration) => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(getAllUnitsOfMeasure());
  }, [dispatch]);

  const mapDataToOptionsMulti = (
    data: IdentifiableEntity[],
    alreadySelected: number[],
  ): DefaultOptionType[] =>
    data
      ?.filter((entity) => entity.isActive || alreadySelected.includes(entity.id as number))
      .map((entity) => ({ label: entity.name, value: entity.id })) ?? [];

  const unitsOfMeasure = useAppSelector((state) => state.unitOfMeasure.data);

  const quantity1Options: DefaultOptionType[] = useMemo(
    () =>
      mapDataToOptionsMulti(
        unitsOfMeasure,
        sliceState.quantities1.map((q) => q.unitOfMeasureId),
      ),
    [unitsOfMeasure, sliceState],
  );

  const quantity2Options: DefaultOptionType[] = useMemo(
    () =>
      mapDataToOptionsMulti(
        unitsOfMeasure,
        sliceState.quantities2.map((q) => q.unitOfMeasureId),
      ),
    [unitsOfMeasure, sliceState],
  );

  const uomOptions: DefaultOptionType[] = useMemo(
    () =>
      mapDataToOptionsMulti(
        unitsOfMeasure,
        sliceState.defaultKg?.unitOfMeasureId ? [sliceState.defaultKg?.unitOfMeasureId] : [],
      ),
    [unitsOfMeasure, sliceState],
  );

  return { quantity1Options, quantity2Options, uomOptions };
};
