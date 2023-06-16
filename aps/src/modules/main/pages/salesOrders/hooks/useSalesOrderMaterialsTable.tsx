/**
 * @module useSalesOrderMaterialsTable
 */

import { ReactNode, useContext } from 'react';
import { useFormContext } from 'react-hook-form';
import { useTable } from '../../../../shared/hooks/table/table.hook';
import { useTranslate } from '../../../../shared/hooks/translate.hook';
import { dateFormatter, nameofFactory } from '../../../../shared/utils/utils';
import { MaintainContext } from '../../../components/maintain/contexts/maintain.context';
import {
  SalesMaterialFormData,
  SalesOrderFormData,
} from '../../settings/redux/salesOrders/interfaces';
import { useProductionOrderModal } from '../productionOrderModal/useProductionOrderModal';

export type Props = {
  onEdit?: (entity: SalesMaterialFormData) => void;
  onDelete?: (entity: SalesMaterialFormData) => void;
};
/**
 *
 * @param onEdit Created in {@link SalesOrderMaterialsTable } component. Defines what happens when user tries to edit a material (a table row).
 * @param onDelete Created in {@link SalesOrderMaterialsTable } component. Defines what happens when user tries to delete a material (a table row).
 * @returns A table component created by {@link TableHook} hook from sales order materials. The sales order materials are extracted from the main form.
 */
export const useSalesOrderMaterialsTable = ({ onDelete, onEdit }: Props): JSX.Element => {
  const { ns } = useContext(MaintainContext);
  const { watch } = useFormContext<SalesOrderFormData>();
  const { salesOrderMaterialsAddAndUpdate: salesOrderMaterials } = watch();

  const { translate } = useTranslate({ ns });
  const nameof = nameofFactory<SalesMaterialFormData>();
  const columns: (keyof SalesMaterialFormData)[] = [
    'sequence',
    'materialId',
    'materialName',
    'materialDescription',
    'quantity1',
    'unitOfMeasure1',
    'quantity2',
    'unitOfMeasure2',
    'requestedDelivery',
    'tanneryDelivery',
  ];

  const { openPOModal, modal } = useProductionOrderModal();
  debugger;
  const customColumns: Partial<Record<keyof SalesMaterialFormData, (value: any) => ReactNode>> = {
    requestedDelivery: (value) => <span>{value ? dateFormatter(value) : ''}</span>,
    tanneryDelivery: (value) => <span>{value ? dateFormatter(value) : ''}</span>,
  };
  const table = useTable({
    dataSource: salesOrderMaterials ?? [],
    translateHeader: translate,
    columnsOrder: columns,
    onEdit,
    onDelete,
    openProductionModal: openPOModal,
    usePaging: false,
    rowKey: nameof('guid'),
    customColumns: customColumns,
  });
  return (
    <>
      {table}
      {modal}
    </>
  );
};
