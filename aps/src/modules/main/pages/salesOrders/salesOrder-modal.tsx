/**
 * @module SalesOrderModal
 */

import CustomInput from '@/modules/shared/components/input/input.component';
import { useTranslate } from '@/modules/shared/hooks/translate.hook';
import { useModalProps } from '@/modules/shared/hooks/useModalProps.hook';
import { nameofFactory } from '@/modules/shared/utils/utils';
import { Modal } from 'antd';
import { ChangeEvent, FC, useContext, useEffect, useMemo, useState } from 'react';
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
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { getAllMaterials } from '../settings/redux/materials/thunks';

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
  const {
    watch,
    setValue,
    formState: { isDirty },
    register,
  } = form;
  const { quantity1, quantity2, materialId } = watch();
  const buttonProps = useModalProps(form);
  const nameof = nameofFactory<SalesMaterialFormData>();
  const { materialOptions } = useSalesOrderOptions();
  const [q1Changed, setQ1changed] = useState<boolean>(false);
  const [q2Changed, setQ2changed] = useState<boolean>(false);

  const { data: materials } = useAppSelector((state) => state.materials);
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(getAllMaterials());
  }, [dispatch]);

  const quantitiesDisabled = useMemo(() => !materialId, [materialId]);

  const selectedMaterialFull = useMemo(
    () => materials.find((mt) => materialId === mt.id),
    [materialId],
  );

  useEffect(() => {
    if (!q1Changed && quantity1 && isDirty && material?.id === 0)
      setValue(
        'quantity2',
        selectedMaterialFull?.factorAreaToPc
          ? selectedMaterialFull?.factorAreaToPc * Number(quantity1)
          : undefined,
      );
  }, [quantity1]);

  useEffect(() => {
    if (
      !q2Changed &&
      quantity2 &&
      selectedMaterialFull?.factorAreaToPc &&
      isDirty &&
      material?.id === 0
    )
      setValue('quantity1', Math.ceil(Number(quantity2) / selectedMaterialFull.factorAreaToPc));
  }, [quantity2]);

  const q1OnBlur = (event: ChangeEvent<HTMLInputElement>) => {
    setQ1changed(true);
  };

  const q2onBlur = (event: ChangeEvent<HTMLInputElement>) => {
    debugger;
    setQ2changed(true);
  };

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
        onCancel={() => {
          onClose();
          setQ1changed(false);
          setQ2changed(false);
        }}
      >
        <CustomInput
          type='number'
          label={translate('sequence')}
          name={nameof('sequence')}
          width='full-width'
          // readOnly={true}
          // disabled={true}
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
          register={register('quantity1')}
          onBlur={q1OnBlur}
          disabled={quantitiesDisabled}
        />
        <CustomInput
          type='readonly'
          label={translate('unitOfMeasure1')}
          name={nameof('unitOfMeasure1')}
        />
        <CustomInput
          type='number'
          label={translate('quantity2')}
          name={nameof('quantity2')}
          onBlur={q2onBlur}
          isRequired={true}
          register={register('quantity2')}
          disabled={quantitiesDisabled}
        />
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
