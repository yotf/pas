/**
 * @module useSalesOrderMaterialFormAutofill
 */

import { useTranslate } from '@/modules/shared/hooks/translate.hook';
import { useAppSelector } from '@/store/hooks';
import { useContext, useEffect, useMemo } from 'react';
import { UseFormReturn } from 'react-hook-form';
import {
  MaintainContext,
  MaintainContextValue,
} from '../../../components/maintain/contexts/maintain.context';
import {
  SalesMaterialFormData,
  SalesOrder,
  SalesOrderFormData,
  SalesOrderResponse,
} from '../../settings/redux/salesOrders/interfaces';
/**
 * Prefills {@link SalesOrderModal} form with values.
 */
export const useFormAutofill = (form: UseFormReturn<SalesMaterialFormData>): void => {
  const materials = useAppSelector((state) => state.materials.data);
  const { watch, setValue, getValues } = form;
  const {
    state: { entity },
  } =
    useContext<MaintainContextValue<SalesOrder, SalesOrderResponse, SalesOrderFormData>>(
      MaintainContext,
    );
  const options = useMemo(
    () => ({
      shouldValidate: true,
      shouldDirty: true,
      shouldTouch: true,
    }),
    [],
  );
  const { materialId, quantity1 } = watch();
  const { translate } = useTranslate({ ns: 'salesOrder' });

  const selectedMaterial = useMemo(
    () => materials.find((mat) => mat.id === Number(materialId || 0)),
    [materialId, materials],
  );


  useEffect(() => {
    if (form.formState.defaultValues && selectedMaterial) {
      setValue(
        'unitOfMeasure1',
        selectedMaterial.unitOfMeasure1?.name || translate('no_uom'),
        options,
      );

      setValue('unitOfMeasure2', selectedMaterial.unitOfMeasure2?.name ?? '', options);
      setValue('materialName', selectedMaterial.name, options);
      setValue('materialDescription', selectedMaterial.features?.name || undefined, options);
      setValue('materialId', selectedMaterial.id, options);
    }
  }, [
    form,
    getValues,
    options,
    selectedMaterial,
    setValue,
    selectedMaterial?.id,
    entity?.salesOrderMaterials,
    translate,
  ]);
};
