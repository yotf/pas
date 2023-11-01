/**
 * @module useSalesOrderMaterialsForm
 */

import { useGeneratedSequence } from '@/modules/shared/hooks/useGeneratedSequence.hook';
import { yupResolver } from '@hookform/resolvers/yup';
import { useCallback, useMemo } from 'react';
import { useForm, useFormContext, UseFormReturn } from 'react-hook-form';
import {
  SalesMaterialFormData,
  SalesOrderFormData,
} from '../../settings/redux/salesOrders/interfaces';
import { useFormAutofill } from './useFormAutofill';
import { useSalesOrderMaterialsSchema } from './useSalesOrderMaterialsSchema';

export type Props = {
  material?: SalesMaterialFormData;
  onClose: () => void;
  option?: 'create' | 'edit';
};

export type Return = {
  form: UseFormReturn<SalesMaterialFormData>;
  onSubmit: () => void;
};
/**
 *
 * @param route Material selected by user when clicking triggering the on edit function in the {@link SalesOrderMaterialsTable} component.
 * @param option Defines if a new material is created or an existing one is being edited
 * @param onClose Clears selected sakes order material and closes the modal
 * @returns Sales order material form used in {@link SalesOrderModal}. The form recalculates sales order materials from the main form and their sequences. When on submit is triggered the main form gets updated.
 */
export const useSalesOrderMaterialsForm = ({ material, onClose, option }: Props): Return => {
  const { watch, setValue, getValues } = useFormContext<SalesOrderFormData>();
  const { salesOrderMaterialsAddAndUpdate } = watch();
  const setMaxSequence =
    option === 'edit'
      ? salesOrderMaterialsAddAndUpdate.length - 1
      : salesOrderMaterialsAddAndUpdate?.length;
  const validationSchema = useSalesOrderMaterialsSchema(setMaxSequence ?? 0);
  const form = useForm<SalesMaterialFormData>({
    resolver: yupResolver(validationSchema),
    mode: 'onBlur',
  });
  useFormAutofill(form);
  useGeneratedSequence(material!, form, 'salesOrderMaterialsAddAndUpdate');

  const recalculateMaterials = useCallback(
    (data: SalesMaterialFormData): SalesMaterialFormData[] => {
      let { salesOrderMaterialsAddAndUpdate: salesOrderMaterials = [] } = getValues();

      salesOrderMaterials = salesOrderMaterials.slice();
      if (material?.sequence !== undefined) {
        const materialIndex = material!.sequence! - 1;
        salesOrderMaterials.splice(materialIndex, 1);
      }

      const materialIndex = data.sequence! - 1;
      const laterOps = salesOrderMaterials.slice(materialIndex);

      salesOrderMaterials = salesOrderMaterials.slice(0, materialIndex);
      salesOrderMaterials.push(data);
      salesOrderMaterials.push(...laterOps);
      return salesOrderMaterials;
    },
    [getValues, material],
  );

  const { handleSubmit } = form;
  const onSubmit = useMemo(
    () =>
      handleSubmit((data: SalesMaterialFormData) => {
        const salesOrderMaterials = recalculateMaterials(data);
        setValue('salesOrderMaterialsAddAndUpdate', salesOrderMaterials, {
          shouldDirty: true,
          shouldTouch: true,
          shouldValidate: true,
        });
        onClose();
      }),
    [handleSubmit, onClose, recalculateMaterials, setValue],
  );

  return { form, onSubmit };
};
