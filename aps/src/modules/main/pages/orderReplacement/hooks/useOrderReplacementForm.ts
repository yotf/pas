/**
 * @module useOrderReplacementForm
 */

import { useAppSelector } from '@/store/hooks';
import { DefaultOptionType } from 'antd/es/select';
import { useCallback, useMemo } from 'react';
import { useFormContext } from 'react-hook-form';
import {
  SalesOrder,
  SalesOrderReplacement,
  OrderReplacementFormData,
} from '../../settings/redux/orderReplacement/interfaces';

export type Return = {
  customerOptions: DefaultOptionType[];
  outSalesOrderNumbers: DefaultOptionType[] | undefined;
  inSalesOrderNumbers: DefaultOptionType[] | undefined;
};

const useSalesOrderNumber = (
  key: keyof OrderReplacementFormData,
  id: number,
): DefaultOptionType[] => {
  const form = useFormContext();
  const { setValue } = form;

  const formData = useAppSelector((state) => state.orderReplacement.form);

  const salesOrdersOptions = useCallback(
    (customerId: number | undefined) => {
      const salesOrders = formData?.find(
        (entity: SalesOrderReplacement) => entity.id == customerId,
      )?.salesOrders;
      return (
        salesOrders?.map((entity: SalesOrder) => ({
          label: entity.orderNumber,
          value: entity.id,
        })) ?? []
      );
    },
    [formData],
  );

  return useMemo(() => {
    setValue(key, undefined, {
      shouldDirty: true,
      shouldTouch: true,
    });
    return salesOrdersOptions(id);
  }, [id, key, salesOrdersOptions, setValue]);
};
/**
 *
 * @returns Customer option and sales order options based on selected customerId
 */
export const useOrderReplacementForm = (): Return => {
  const form = useFormContext();
  const { watch } = form;

  const formData = useAppSelector((state) => state.orderReplacement.form);
  const customerOptions: DefaultOptionType[] = useMemo(
    () =>
      formData?.map((entity: SalesOrderReplacement) => ({
        label: entity.name,
        value: entity.id,
      })) ?? [],
    [formData],
  );
  const { outCustomerId, inCustomerId } = watch();

  const outSalesOrderNumbers = useSalesOrderNumber('outSalesOrderNumberId', outCustomerId);
  const inSalesOrderNumbers = useSalesOrderNumber('inSalesOrderNumberId', inCustomerId);

  return {
    customerOptions,
    outSalesOrderNumbers,
    inSalesOrderNumbers,
  };
};
