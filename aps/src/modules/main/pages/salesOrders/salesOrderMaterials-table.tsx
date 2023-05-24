/**
 * @module SalesOrderMaterialsTable
 */

import { useCallback, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { v4 as uuid } from 'uuid';
import {
  SalesMaterialFormData,
  SalesOrderFormData,
} from '../settings/redux/salesOrders/interfaces';
import { useSalesOrderMaterialsTable } from './hooks/useSalesOrderMaterialsTable';
import SalesOrderModal from './salesOrder-modal';

export type UseSalesOrderMaterialModalReturn = {
  tableAndModal: JSX.Element;
  onAddMaterial: () => void;
};
/**
 *
 * @returns Table rendered by {@link useSalesOrderMaterialsTable} hook. The onEdit function chooses a material which opens {@link SalesOrderModal | Sales order modal} for editing
 * materials of the sales order. The on delete function remove a material from the array which is contained in the main form (form from {@link useSalesOrderForm}).
 */
export const useSalesOrderMaterialsModal = (): UseSalesOrderMaterialModalReturn => {
  const { getValues, setValue } = useFormContext<SalesOrderFormData>();
  const [material, setMaterial] = useState<SalesMaterialFormData>();
  const onClose = useCallback(() => setMaterial(undefined), []);
  const onAddMaterial = useCallback(() => {
    setMaterial({
      id: 0,
      guid: uuid(),
      sequence: undefined,
      materialId: undefined,
      quantity1: undefined,
      quantity2: undefined,
      unitOfMeasure1: undefined,
      unitOfMeasure2: undefined,
      requestedDelivery: undefined,
      materialName: '',
      tanneryDelivery: undefined,
    });
  }, []);
  const onEditOperation = useCallback((selectedMaterial: SalesMaterialFormData) => {
    setMaterial(selectedMaterial);
  }, []);
  const onDeleteOperation = useCallback(
    (selectedMaterial: SalesMaterialFormData) => {
      const salesOrderMaterials = getValues().salesOrderMaterialsAddAndUpdate ?? [];
      salesOrderMaterials.splice(selectedMaterial.sequence! - 1, 1);
      setValue('salesOrderMaterialsAddAndUpdate', salesOrderMaterials, {
        shouldDirty: true,
        shouldTouch: true,
        shouldValidate: true,
      });
    },
    [getValues, setValue],
  );

  const table = useSalesOrderMaterialsTable({
    onEdit: onEditOperation,
    onDelete: onDeleteOperation,
  });

  const tableAndModal = (
    <div className='materials-container'>
      {table}
      <SalesOrderModal onClose={onClose} material={material} />
    </div>
  );

  return { tableAndModal, onAddMaterial };
};
