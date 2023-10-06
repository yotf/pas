/**
 * @module ConfirmationModal
 */

import warningIcon from '@/assets/warning.svg';
import '@/modules/main/pages/settings/components/entity-delete-modal.component.scss';
import { useTranslate } from '@/modules/shared/hooks/translate.hook';
import { useAppDispatch } from '@/store/hooks';
import { Modal } from 'antd';
import { Dispatch, SetStateAction, useCallback, useMemo } from 'react';
import { useFormContext } from 'react-hook-form';
import { ReallocationOfPlanningForm } from '../../../settings/redux/reallocationOfPlanning/interfaces';
import { upsertReallocation } from '../../../settings/redux/reallocationOfPlanning/thunks';
import { updateProductionOrderStatus } from '../../../settings/redux/productionOrders/productionOrdersStatus/thunks';
import { ProductionOrder } from '../../../settings/redux/productionOrders/interfaces';

export type ConfirmationModalProps = {
  open: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  selectedProductionOrder?: ProductionOrder;
};
/**
 *
 * @param isOpen Is modal open or closed
 * @param setIsOpen Used for closing the modal
 * @returns Confirmation modal for changing status of production order and its operation
 */
export const ConfirmationModal = ({
  open: isOpen,
  setIsOpen,
  selectedProductionOrder,
}: ConfirmationModalProps): JSX.Element => {
  const dispatch = useAppDispatch();

  const { translate } = useTranslate({
    ns: 'confirmation_modal',
  });

  const closeModal = useCallback((): void => {
    setIsOpen(false);
  }, [setIsOpen]);

  const form = useFormContext<ReallocationOfPlanningForm>();

  const {
    handleSubmit,
    formState: { isValid },
  } = form;

  const onSubmit = useMemo(
    () =>
      handleSubmit((data: ReallocationOfPlanningForm) => {
        dispatch(
          updateProductionOrderStatus({
            productionOrders: [selectedProductionOrder?.id!],
            statusOfPlanningEnum: selectedProductionOrder?.statusOfPlanningEnum! - 1,
          }),
        );
      }),
    [dispatch, handleSubmit],
  );

  const handleOk = useCallback((): void => {
    onSubmit();
    closeModal();
  }, [closeModal, onSubmit]);

  const modal: JSX.Element = (
    <Modal
      centered
      open={isOpen}
      okText={translate('ok_text')}
      onOk={handleOk}
      okButtonProps={{ disabled: !isValid }}
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

  return modal;
};
