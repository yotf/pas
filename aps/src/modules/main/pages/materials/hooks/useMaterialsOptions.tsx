/**
 * @module UseMaterialsOptions
 */

import { mapDataToOptions } from '@/modules/shared/utils/utils';
import { DefaultOptionType } from 'antd/lib/select';
import { useEffect, useMemo } from 'react';
import { useAppDispatch, useAppSelector } from '../../../../../store/hooks';
import { getAllArticles } from '../../settings/redux/articles/thunks';
import { getAllColors } from '../../settings/redux/colors/thunks';
import { getAllFeatures } from '../../settings/redux/features/thunks';
import { getAllMaterialGroups } from '../../settings/redux/materialGroups/thunks';
import { getAllRoutings } from '../../settings/redux/routings/thunks';
import { getAllSelections } from '../../settings/redux/selections/thunks';
import { getAllSizeRanges } from '../../settings/redux/sizeRanges/thunks';
import { getAllThickness } from '../../settings/redux/thickness/thunks';
import { getAllUnitsOfMeasure } from '../../settings/redux/unitOfMeasure/thunks';

export type UseRoutingSetupReturnType = {
  unitOptions: DefaultOptionType[];
  materialGroupOptions: DefaultOptionType[];
  articleOptions: DefaultOptionType[];
  colorOptions: DefaultOptionType[];
  thicknessOptions: DefaultOptionType[];
  sizeRangeOptions: DefaultOptionType[];
  selectionOptions: DefaultOptionType[];
  routingOptions: DefaultOptionType[];
  featureOptions: DefaultOptionType[];
};
/**
 * Fetches and converts data to options usable by select and radio inputs.
 * @returns An object containing arrays of objects with values and labels.
 */
export const useMaterialsOptions = (): UseRoutingSetupReturnType => {
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(getAllUnitsOfMeasure());
    dispatch(getAllMaterialGroups());
    dispatch(getAllArticles());
    dispatch(getAllColors());
    dispatch(getAllThickness());
    dispatch(getAllSizeRanges());
    dispatch(getAllSelections());
    dispatch(getAllRoutings());
    dispatch(getAllFeatures());
  }, [dispatch]);

  const {
    unitOfMeasures,
    materialGroups,
    articles,
    colors,
    thickness,
    sizeRanges,
    selections,
    routings,
    features,
  } = useAppSelector((state) => ({
    unitOfMeasures: state.unitOfMeasure.data,
    customers: state.customers.data,
    materialGroups: state.materialGroups.data,
    articles: state.articles.data,
    colors: state.colors.data,
    thickness: state.thickness.data,
    sizeRanges: state.sizeRanges.data,
    selections: state.selections.data,
    routings: state.routings.data,
    features: state.features.data,
  }));

  const unitOptions: DefaultOptionType[] = useMemo(
    () => mapDataToOptions(unitOfMeasures),
    [unitOfMeasures],
  );

  const materialGroupOptions: DefaultOptionType[] = useMemo(
    () => mapDataToOptions(materialGroups),
    [materialGroups],
  );

  const articleOptions: DefaultOptionType[] = useMemo(() => mapDataToOptions(articles), [articles]);

  const colorOptions: DefaultOptionType[] = useMemo(() => mapDataToOptions(colors), [colors]);

  const thicknessOptions: DefaultOptionType[] = useMemo(
    () => mapDataToOptions(thickness),
    [thickness],
  );

  const sizeRangeOptions: DefaultOptionType[] = useMemo(
    () => mapDataToOptions(sizeRanges),
    [sizeRanges],
  );

  const selectionOptions: DefaultOptionType[] = useMemo(
    () => mapDataToOptions(selections),
    [selections],
  );

  const featureOptions: DefaultOptionType[] = useMemo(() => mapDataToOptions(features), [features]);

  const routingOptions: DefaultOptionType[] = useMemo(() => mapDataToOptions(routings), [routings]);

  return {
    unitOptions,
    materialGroupOptions,
    articleOptions,
    colorOptions,
    thicknessOptions,
    sizeRangeOptions,
    selectionOptions,
    routingOptions,
    featureOptions,
  };
};
