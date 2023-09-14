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
import { getConfiguration } from '../../settings/redux/configuration/thunks';
import { Material } from '../../settings/redux/materials/interfaces';

export type UseRoutingSetupReturnType = {
  unit1Options: DefaultOptionType[];
  unit2Options: DefaultOptionType[];
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
export const useMaterialsOptions = (entity?: Material): UseRoutingSetupReturnType => {
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
    dispatch(getConfiguration());
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
    configuration,
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
    configuration: state.configuration.data,
  }));

  const unit1Options: DefaultOptionType[] = useMemo(
    () =>
      mapDataToOptions(
        configuration.quantities1.map((q) => q.unitOfMeasure!),
        entity?.unitOfMeasure1
          ? { label: entity.unitOfMeasure1.name, value: entity.unitOfMeasure1.id! }
          : undefined,
      ),
    [unitOfMeasures, entity?.unitOfMeasure1],
  );

  const unit2Options: DefaultOptionType[] = useMemo(
    () =>
      mapDataToOptions(
        configuration.quantities2.map((q) => q.unitOfMeasure!),
        entity?.unitOfMeasure2
          ? { label: entity.unitOfMeasure2.name, value: entity.unitOfMeasure2.id! }
          : undefined,
      ),
    [unitOfMeasures, entity?.unitOfMeasure2],
  );

  const materialGroupOptions: DefaultOptionType[] = useMemo(
    () =>
      mapDataToOptions(
        materialGroups,
        entity?.materialGroup
          ? { label: entity.materialGroup.name, value: entity.materialGroup.id! }
          : undefined,
      ),
    [materialGroups, entity?.materialGroup],
  );

  const articleOptions: DefaultOptionType[] = useMemo(
    () =>
      mapDataToOptions(
        articles,
        entity?.article ? { label: entity.article.name, value: entity.article.id! } : undefined,
      ),
    [articles, entity?.article],
  );

  const colorOptions: DefaultOptionType[] = useMemo(
    () =>
      mapDataToOptions(
        colors,
        entity?.color ? { label: entity.color.name, value: entity.color.id! } : undefined,
      ),
    [colors, entity?.color],
  );

  const thicknessOptions: DefaultOptionType[] = useMemo(
    () =>
      mapDataToOptions(
        thickness,
        entity?.thickness
          ? { label: entity.thickness.name, value: entity.thickness.id! }
          : undefined,
      ),
    [thickness, entity?.thickness],
  );

  const sizeRangeOptions: DefaultOptionType[] = useMemo(
    () =>
      mapDataToOptions(
        sizeRanges,
        entity?.sizeRange
          ? { label: entity.sizeRange.name, value: entity.sizeRange.id! }
          : undefined,
      ),
    [sizeRanges, entity?.sizeRange],
  );

  const selectionOptions: DefaultOptionType[] = useMemo(() => {
    debugger;
    return mapDataToOptions(
      selections,
      entity?.selection ? { label: entity.selection.name, value: entity.selection.id! } : undefined,
    );
  }, [selections, entity?.selection]);

  const featureOptions: DefaultOptionType[] = useMemo(
    () =>
      mapDataToOptions(
        features,
        entity?.features ? { label: entity.features.name, value: entity.features.id! } : undefined,
      ),
    [features, entity?.features],
  );

  const routingOptions: DefaultOptionType[] = useMemo(
    () =>
      mapDataToOptions(
        routings,
        entity?.routing ? { label: entity.routing.name, value: entity.routing.id! } : undefined,
      ),
    [routings, entity?.routing],
  );

  return {
    unit1Options,
    unit2Options,
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
