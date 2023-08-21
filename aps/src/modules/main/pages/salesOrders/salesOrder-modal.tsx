/**
 * @module SalesOrderModal
 */

import CustomInput from '@/modules/shared/components/input/input.component';
import { useTranslate } from '@/modules/shared/hooks/translate.hook';
import { useModalProps } from '@/modules/shared/hooks/useModalProps.hook';
import { limitNumberOfChars, limitToFloat, limitToNumericKeyDown, nameofFactory } from '@/modules/shared/utils/utils';
import { Modal } from 'antd';
import {
  ChangeEvent,
  FC,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
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
import { flushSync } from 'react-dom';

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
  const { materialId } = watch();
  const buttonProps = useModalProps(form);
  const nameof = nameofFactory<SalesMaterialFormData>();
  const { materialOptions } = useSalesOrderOptions();

  const [quantityExited, setQuantityExited] = useState<boolean>(false);
  const quantityExitedRef = useRef(quantityExited);

  const { data: materials } = useAppSelector((state) => state.materials);
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(getAllMaterials());
  }, [dispatch]);

  const quantitiesDisabled = useMemo(() => !materialId, [materialId]);

  useEffect(() => {
    quantityExitedRef.current = quantityExited;
  }, [quantityExited]);

  const selectedMaterialFull = useMemo(
    () => materials.find((mt) => materialId === mt.id),
    [materialId],
  );

  const onQ1change = (value: number | string) => {
    const q1 = value;
    if (!quantityExitedRef.current && !!q1 && material?.id === 0) {
      setValue(
        'quantity2',
        selectedMaterialFull?.factorAreaToPc
          ? selectedMaterialFull?.factorAreaToPc * Number(q1)
          : undefined,
      );
    }
  };

  const onQ2change = (value: number | string) => {
    const q2 = value;
    if (
      !quantityExitedRef.current &&
      !!q2 &&
      selectedMaterialFull?.factorAreaToPc &&
      material?.id === 0
    ) {
      setValue('quantity1', Math.ceil(Number(q2) / selectedMaterialFull.factorAreaToPc));
    }
  };

  const onQuantityBlur = (event: ChangeEvent<HTMLInputElement>) => {
    flushSync(() => {
      setQuantityExited(true);
      quantityExitedRef.current = true;
    });
  };

  const handleSubmit = useCallback(() => {
    setQuantityExited(false);
    quantityExitedRef.current = false;
    onSubmit();
  }, [onSubmit]);

  return (
    <FormProvider {...form}>
      <Modal
        {...buttonProps}
        className='sales-order-modal'
        centered
        open={!!material}
        title={translate('add_operation')}
        okText={translate('save')}
        onOk={handleSubmit}
        cancelText={translate('cancel')}
        onCancel={() => {
          onClose();
          setQuantityExited(false);
          quantityExitedRef.current = false;
        }}
      >
        <CustomInput
          type='tel'
          pattern='[0-9]*'
          label={translate('sequence')}
          name={nameof('sequence')}
          width='full-width'
          maxLength={3}
          onKeyDownEvent={limitToNumericKeyDown}
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
          type='tel'
          pattern='[0-9]*'
          label={translate('quantity1')}
          name={nameof('quantity1')}
          register={register('quantity1')}
          onBlur={onQuantityBlur}
          disabled={quantitiesDisabled}
          onTextChange={onQ1change}
          maxLength={6}
          onKeyDownEvent={limitToNumericKeyDown}
        />
        <CustomInput
          type='readonly'
          label={translate('unitOfMeasure1')}
          name={nameof('unitOfMeasure1')}
        />
        <CustomInput
        
          type='tel'
          pattern='[0-9]*\.?[0-9]*'
          label={translate('quantity2')}
          name={nameof('quantity2')}
          onBlur={onQuantityBlur}
          isRequired={true}
          register={register('quantity2')}
          onTextChange={onQ2change}
          disabled={quantitiesDisabled}
          onKeyDownEvent={limitToFloat}
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
