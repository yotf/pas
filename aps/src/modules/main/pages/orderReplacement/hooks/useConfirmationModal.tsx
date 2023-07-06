/**
 * @module UseConfirmationModal
 */

import warningIcon from '@/assets/warning.svg';
import '@/modules/main/pages/settings/components/entity-delete-modal.component.scss';
import { notificationSuccess } from '@/modules/shared/services/notification.service';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { Modal } from 'antd';
import { useCallback, useMemo, useState } from 'react';
import { useFormContext, UseFormReturn } from 'react-hook-form';
import { OrderReplacementFormData } from '../../settings/redux/orderReplacement/interfaces';
import { clearOrderReplacementData } from '../../settings/redux/orderReplacement/slices';
import { performOrderReplacement } from '../../settings/redux/orderReplacement/thunks';

export type UseConfirmationModalReturn = {
  modal: JSX.Element;
  openConfirmationModal: () => void;
};
/**
 *
 * @param translate Localization Funtion
 * @returns Modal used for confirming order replacement
 */
export const useConfirmationModal = (
  translate: (value: string, options?: Record<string, string> | undefined) => string,
): UseConfirmationModalReturn => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const { inProductionOrders, outProductionOrders } = useAppSelector(
    (state) => state.orderReplacement.data,
  );

  const closeModal = useCallback((): void => {
    setIsOpen(false);
  }, []);
  const openConfirmationModal = useCallback((): void => {
    setIsOpen(true);
  }, []);
  const dispatch = useAppDispatch();
  const form: UseFormReturn<OrderReplacementFormData> = useFormContext();
  const { handleSubmit } = form;

  const handleOk = useMemo(
    () =>
      handleSubmit((formData: OrderReplacementFormData) => {
      
        const data = {
          outProductionOrders: outProductionOrders.map((po) => po.id),
          inProductionOrders: inProductionOrders.map((po) => po.id),
        };
    
        dispatch(performOrderReplacement(data));
        dispatch(clearOrderReplacementData());
        //    notificationSuccess(translate('create_success'));
        form.reset(undefined, {
          keepIsSubmitted: false,
        });
        //
        closeModal();
      }),
    [closeModal, dispatch, form, handleSubmit, translate, inProductionOrders, outProductionOrders],
  );

  const modal: JSX.Element = (
    <Modal
      centered
      open={isOpen}
      okText={translate('ok_text')}
      onOk={handleOk}
      cancelText={translate('cancel')}
      onCancel={closeModal}
      closable={false}
    >
      <div className='confirm-modal-content'>
        <img src={warningIcon} alt={'warning'} />
        <span>{translate('confirmation_message')}</span>
      </div>
    </Modal>
  );

  return { modal, openConfirmationModal };
};
