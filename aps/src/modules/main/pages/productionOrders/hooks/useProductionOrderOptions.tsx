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
import { getAllSelections } from '../../settings/redux/selections/thunks';
import { getAllThickness } from '../../settings/redux/thickness/thunks';
import { getAllUnitsOfMeasure } from '../../settings/redux/unitOfMeasure/thunks';
import { getSalesOrdersWithMaterials } from '../../settings/redux/salesOrders/salesOrdersWithMaterials/thunks';
import { ProductionOrder } from '../../settings/redux/productionOrders/interfaces';
import { getProductionOrderNumbers } from '../../settings/redux/productionOrders/productionOrderOrderNumbers/thunks';
import { getConfiguration } from '../../settings/redux/configuration/thunks';
import { SettingsPageItem } from '../../settings/consts/interfaces';

export type UseProductionOrderOptions = {
  customerOptions: DefaultOptionType[];
  orderTypeOptions: DefaultOptionType[];
  materialOptions: DefaultOptionType[];
  //salesOrderOptions: DefaultOptionType[];
  routingOptions: DefaultOptionType[];
  // unitOfMeasureOptions: DefaultOptionType[];
  salesOrderSequenceOptions: DefaultOptionType[];
  originPOOptions: DefaultOptionType[];
  defaultKg: SettingsPageItem | undefined;
};
/**
 * Fetches and converts data to options usable by select and radio inputs.
 * @returns An object containing arrays of objects with values and labels
 */
export const useProductionOrderOptions = (
  entity: ProductionOrder | undefined,
  customerId: number | undefined,
): UseProductionOrderOptions => {
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(getAllCustomers());
    dispatch(getAllProductionOrderTypes());
    dispatch(getAllMaterials());
    dispatch(getAllRoutings());
    dispatch(getAllUnitsOfMeasure());
    // dispatch(getAllMaterialGroups());
    // dispatch(getAllArticles());
    // dispatch(getAllColors());
    // dispatch(getAllThickness());
    // dispatch(getAllSelections());
    dispatch(getSalesOrdersWithMaterials());
    dispatch(getProductionOrderNumbers());
    dispatch(getConfiguration());
  }, [dispatch]);

  const {
    customers,
    productionOrderTypes,
    materials,
    salesOrders,
    routings,
    // unitsOfMeasure,
    productionOrderNumbers,
    configuration,
  } = useAppSelector((state) => ({
    customers: state.customers.data,
    productionOrderTypes: state.productionOrderTypes.data,
    materials: state.materials.data,
    salesOrders: state.salesOrdersWithMaterials.data,
    routings: state.routings.data,
    //   unitsOfMeasure: state.unitOfMeasure.data,
    productionOrderNumbers: state.productionOrderNumbers.data,
    configuration: state.configuration.data,
  }));

  const customerOptions: DefaultOptionType[] = useMemo(
    () =>
      mapDataToOptions(
        customers,
        entity?.customerDto
          ? { value: entity.customerDto.id!, label: entity.customerDto.name }
          : undefined,
      ),
    [customers, entity?.customerDto],
  );

  const orderTypeOptions: DefaultOptionType[] = useMemo(
    () =>
      mapDataToOptions(
        productionOrderTypes,
        entity?.productionOrderTypeDto
          ? { value: entity.productionOrderTypeDto.id, label: entity.productionOrderTypeDto.name }
          : undefined,
      ),
    [productionOrderTypes, entity?.productionOrderTypeDto],
  );

  const materialOptions: DefaultOptionType[] = useMemo(
    () =>
      mapDataToOptions(
        materials,
        entity?.materialDto
          ? { value: entity.materialDto.id, label: entity.materialDto.name }
          : undefined,
      ),
    [materials, entity?.materialDto],
  );

  const defaultKg = useMemo(() => configuration.defaultKg?.unitOfMeasure, [configuration]);

  const routingOptions: DefaultOptionType[] = useMemo(
    () =>
      mapDataToOptions(
        routings,
        entity?.routingDto
          ? {
              value: entity?.routingDto.id,
              label: entity.routingDto.name,
            }
          : undefined,
      ),
    [routings, entity?.routingDto],
  );

  // const unitOfMeasureOptions: DefaultOptionType[] = useMemo(
  //   () => mapDataToOptions(unitsOfMeasure),
  //   [unitsOfMeasure],
  // );

  const originPOOptions: DefaultOptionType[] = useMemo(() => {
    return (
      productionOrderNumbers
        ?.filter((po) => po.id !== entity?.id)
        .map((po) => ({ label: po.orderNumber, value: po.id })) ?? []
    );
  }, [productionOrderNumbers]);

  const salesOrderSequenceOptions: DefaultOptionType[] = useMemo(() => {
    const salesOrderMaterialValuePairs: any = [];
    const salesOrderMaterialLabelPairs: any = [];

    salesOrders
      .filter((so) => so.customerId === customerId)
      .forEach((so) => {
        so.salesOrderMaterials?.forEach((som) => {
          salesOrderMaterialValuePairs.push(`${so.id}-${som.id}`);
          salesOrderMaterialLabelPairs.push(`${so.orderNumber} - Seq. ${som.sequence}`);
        });
      });

    const combined = salesOrderMaterialValuePairs.map((value: any, ix: number) => {
      const label = salesOrderMaterialLabelPairs[ix];
      return { value, label };
    });
    return combined;
  }, [salesOrders, customerId]);

  return {
    customerOptions,
    orderTypeOptions,
    materialOptions,
    routingOptions,
    salesOrderSequenceOptions,
    originPOOptions,
    defaultKg,
  };
};
