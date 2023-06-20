/**
 * @module SalesOrderModal
 */

import CustomInput from '@/modules/shared/components/input/input.component';
import { useTranslate } from '@/modules/shared/hooks/translate.hook';
import { useModalProps } from '@/modules/shared/hooks/useModalProps.hook';
import { nameofFactory } from '@/modules/shared/utils/utils';
import { Modal } from 'antd';
import { FC, useContext } from 'react';
import { FormProvider } from 'react-hook-form';
import {
  MaintainContext,
  MaintainContextValue,
} from '../../components/maintain/contexts/maintain.context';

import {
  SalesMaterialFormData,
  SalesOrder,
  SalesOrderFormData,
  SalesOrderResponse,
} from '../settings/redux/salesOrders/interfaces';

import { useSalesOrderMaterialsForm } from './hooks/useSalesOrderMaterialsForm';
import { useSalesOrderOptions } from './hooks/useSalesOrderOptions';
import './salesOrder-modal.scss';

export type Props = {
  material?: SalesMaterialFormData;
  onClose: () => void;
  option?: 'create' | 'edit';
};
/**
 * @param material Material selected by user when triggering the on edit function in the {@link SalesOrderMaterialsTable}.
 * @param onClose Clears selected material and closes the modal
 * @returns A modal for deleting and editing sales order materials. The onOk function will change materials defined in the main form
 */
const SalesOrderModal: FC<Props> = ({ material, onClose, option }) => {
  const { ns } =
    useContext<MaintainContextValue<SalesOrder, SalesOrderResponse, SalesOrderFormData>>(
      MaintainContext,
    );

  const { translate } = useTranslate({ ns });
  const { form, onSubmit } = useSalesOrderMaterialsForm({ material, onClose, option });
  const buttonProps = useModalProps(form);
  const nameof = nameofFactory<SalesMaterialFormData>();
  const { materialOptions } = useSalesOrderOptions();

  return (
    <FormProvider {...form}>
      <Modal
        {...buttonProps}
        className='sales-order-modal'
        centered
        open={!!material}
        title={translate('add_operation')}
        okText={translate('save')}
        onOk={onSubmit}
        cancelText={translate('cancel')}
        onCancel={onClose}
      >
        <CustomInput
          type='number'
          label={translate('sequence')}
          name={nameof('sequence')}
          width='full-width'
        />

        <CustomInput
          type='select'
          label={translate('material')}
          name={nameof('materialId')}
          options={materialOptions}
          isRequired={true}
          isAutocomplete={true}
        />

        <CustomInput
          isRequired={true}
          type='number'
          label={translate('quantity1')}
          name={nameof('quantity1')}
        />
        <CustomInput
          type='readonly'
          label={translate('unitOfMeasure1')}
          name={nameof('unitOfMeasure1')}
        />
        <CustomInput type='readonly' label={translate('quantity2')} name={nameof('quantity2')} />
        <CustomInput
          type='readonly'
          label={translate('unitOfMeasure2')}
          name={nameof('unitOfMeasure2')}
        />

        <CustomInput
          type='date'
          label={translate('deliveryDate')}
          name={nameof('requestedDelivery')}
          noPastDates={true}
        />
      </Modal>
    </FormProvider>
  );
};

export default SalesOrderModal;
