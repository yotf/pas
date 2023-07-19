/**
 * @module useSalesOrderForm
 */

import { useCallback, useEffect, useMemo } from 'react';
import { Path, UseFormReturn } from 'react-hook-form';
import { v4 as uuid } from 'uuid';
import { useMaintainForm } from '../../../components/maintain/hooks/useMaintainForm';
import {
  SalesOrderFormData,
  SalesOrderResponse,
  SalesOrdersResponse,
} from '../../settings/redux/salesOrders/interfaces';
import { clearSalesOrder } from '../../settings/redux/salesOrders/slice';
import { getSalesOrder } from '../../settings/redux/salesOrders/thunks';
import { useSalesOrderSchema } from './useSalesOrderSchema';

export type UseRoutingSetupPropsType = {
  copy?: boolean;
  state: SalesOrdersResponse;
};
/**
 * @param copy If copy is true values are copied from an already created Material and placed inside the form.
 * Creates a mapping function and a indicates which fields cannot be duplicated. Creates a validation schema using {@link useSalesOrderSchema}.
 * Mentioned values are passed down to {@link useMaintainForm}.
 * @returns A form created by {@link useMaintainForm}.
 */
export const UseSalesOrderForm = ({
  state,
  copy,
}: UseRoutingSetupPropsType): UseFormReturn<SalesOrderFormData, any> => {
  const validationSchema = useSalesOrderSchema();
  const duplicateErrors: Record<string, Path<SalesOrderFormData>> = useMemo(
    () => ({
      DuplicateSalesOrderName: 'orderNumber',
    }),
    [],
  );

  const mapEntityToFormData: (entity?: SalesOrderResponse) => SalesOrderFormData = useCallback(
    (entity) =>
      !entity || entity?.id === 0
        ? {
            id: 0,
            orderNumber: undefined,
            orderTypeId: undefined,
            customerId: undefined,
            customerOrderNumber: '',
            status: 1,
            remark: '',
            salesOrderMaterialsAddAndUpdate: [],
            salesOrderDelivery: undefined,
          }
        : {
            id: copy ? 0 : entity.id,
            orderNumber: copy ? undefined : entity.orderNumber,
            orderTypeId: entity.orderTypeId,
            customerId: entity.customerId,
            customerOrderNumber: entity.customerOrderNumber,
            status: entity.status,
            remark: entity.remark,
            salesOrderDelivery: entity.salesOrderDelivery,
            salesOrderMaterialsAddAndUpdate:
              entity.salesOrderMaterials?.map(
                ({ material, requestedDelivery, tanneryDelivery, id, sequence, ...rest }, i) => ({
                  ...rest,
                  id: copy ? 0 : id,
                  guid: uuid(),
                  materialDescription: material.features?.name,
                  materialName: material.name,
                  sequence: sequence,
                  unitOfMeasure1: material.unitOfMeasure1?.name,
                  unitOfMeasure2: material.unitOfMeasure2?.name,
                  requestedDelivery: requestedDelivery,
                  tanneryDelivery: tanneryDelivery,
                }),
              ) ?? [],
          },
    [],
  );
  const form = useMaintainForm({
    ns: 'salesOrder',
    validationSchema,
    duplicateErrors,
    mapEntityToFormData,
    state,
    clearEntity: clearSalesOrder,
    readThunk: getSalesOrder,
  });

  const { setValue, watch } = form;
  const { salesOrderMaterialsAddAndUpdate } = watch();
  useEffect(() => {
    salesOrderMaterialsAddAndUpdate?.forEach((o, i) => (o.sequence = i + 1));
    setValue('salesOrderMaterialsAddAndUpdate', salesOrderMaterialsAddAndUpdate);
  }, [JSON.stringify(salesOrderMaterialsAddAndUpdate), setValue]);

  return form;
};
