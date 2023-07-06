import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { useEffect, useMemo } from 'react';
import { getAllUnitsOfMeasure } from '../../settings/redux/unitOfMeasure/thunks';
import { DefaultOptionType } from 'antd/es/select';
import { mapDataToOptions } from '@/modules/shared/utils/utils';

export const useConfigurationOptions = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(getAllUnitsOfMeasure());
  }, [dispatch]);

  const unitsOfMeasure = useAppSelector((state) => state.unitOfMeasure.data);

  const quantityOptions: DefaultOptionType[] = useMemo(
    () => mapDataToOptions(unitsOfMeasure),
    [unitsOfMeasure],
  );

  return quantityOptions;
};
