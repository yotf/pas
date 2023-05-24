/**
 * @module useProductionOrderOptions
 */

import { mapDataToOptions } from '@/modules/shared/utils/utils';
import { DefaultOptionType } from 'antd/lib/select';
import { useEffect, useMemo } from 'react';
import { useAppDispatch, useAppSelector } from '../../../../../store/hooks';
import { getAllArticles } from '../../settings/redux/articles/thunks';
import { getAllColors } from '../../settings/redux/colors/thunks';
import { getAllCustomers } from '../../settings/redux/customers/thunks';
import { getAllMaterialGroups } from '../../settings/redux/materialGroups/thunks';
import { getAllMaterials } from '../../settings/redux/materials/thunks';
import { getAllProductionOrderTypes } from '../../settings/redux/productionOrderTypes/thunks';
import { getAllRoutings } from '../../settings/redux/routings/thunks';
import { SalesOrder } from '../../settings/redux/salesOrders/interfaces';
import { getAllSalesOrders } from '../../settings/redux/salesOrders/thunks';
import { getAllSelections } from '../../settings/redux/selections/thunks';
import { getAllThickness } from '../../settings/redux/thickness/thunks';
import { getAllUnitsOfMeasure } from '../../settings/redux/unitOfMeasure/thunks';

export type UseProductionOrderOptions = {
  customerOptions: DefaultOptionType[];
  orderTypeOptions: DefaultOptionType[];
  materialOptions: DefaultOptionType[];
  salesOrderOptions: DefaultOptionType[];
  routingOptions: DefaultOptionType[];
  unitOfMeasureOptions: DefaultOptionType[];
  materialGroupOptions: DefaultOptionType[];
  colorOptions: DefaultOptionType[];
  articleOptions: DefaultOptionType[];
  thicknessOptions: DefaultOptionType[];
  selectionOptions: DefaultOptionType[];
};
/**
 * Fetches and converts data to options usable by select and radio inputs.
 * @returns An object containing arrays of objects with values and labels
 */
export const useProductionOrderOptions = (): UseProductionOrderOptions => {
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(getAllCustomers());
    dispatch(getAllProductionOrderTypes());
    dispatch(getAllMaterials());
    dispatch(getAllSalesOrders());
    dispatch(getAllRoutings());
    dispatch(getAllUnitsOfMeasure());
    dispatch(getAllMaterialGroups());
    dispatch(getAllArticles());
    dispatch(getAllColors());
    dispatch(getAllThickness());
    dispatch(getAllSelections());
  }, [dispatch]);

  const {
    customers,
    productionOrderTypes,
    materials,
    salesOrders,
    routings,
    unitsOfMeasure,
    materialGroups,
    articles,
    colors,
    thickness,
    selections,
  } = useAppSelector((state) => ({
    customers: state.customers.data,
    productionOrderTypes: state.productionOrderTypes.data,
    materials: state.materials.data,
    salesOrders: state.salesOrders.data,
    routings: state.routings.data,
    unitsOfMeasure: state.unitOfMeasure.data,
    materialGroups: state.materialGroups.data,
    articles: state.articles.data,
    colors: state.colors.data,
    thickness: state.thickness.data,
    selections: state.selections.data,
  }));

  const customerOptions: DefaultOptionType[] = useMemo(
    () => mapDataToOptions(customers),
    [customers],
  );

  const orderTypeOptions: DefaultOptionType[] = useMemo(
    () => mapDataToOptions(productionOrderTypes),
    [productionOrderTypes],
  );

  const materialOptions: DefaultOptionType[] = useMemo(
    () => mapDataToOptions(materials),
    [materials],
  );

  const routingOptions: DefaultOptionType[] = useMemo(() => mapDataToOptions(routings), [routings]);

  const unitOfMeasureOptions: DefaultOptionType[] = useMemo(
    () => mapDataToOptions(unitsOfMeasure),
    [unitsOfMeasure],
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

  const selectionOptions: DefaultOptionType[] = useMemo(
    () => mapDataToOptions(selections),
    [selections],
  );

  const mapSalesOrdersToOptions = (data: SalesOrder[]): DefaultOptionType[] =>
    data
      .filter((so) => so.statusInfo.id !== 3)
      .map((filteredSO) => ({ label: filteredSO.orderNumber, value: filteredSO.orderNumber }));

  const salesOrderOptions: DefaultOptionType[] = useMemo(
    () => mapSalesOrdersToOptions(salesOrders),
    [salesOrders],
  );

  return {
    customerOptions,
    orderTypeOptions,
    materialOptions,
    salesOrderOptions,
    routingOptions,
    unitOfMeasureOptions,
    materialGroupOptions,
    articleOptions,
    colorOptions,
    thicknessOptions,
    selectionOptions,
  };
};
