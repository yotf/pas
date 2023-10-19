import { useTranslate } from '@/modules/shared/hooks/translate.hook';
import { useAppDispatch } from '@/store/hooks';
import { Modal } from 'antd';
import { useCallback } from 'react';
import { reallocateOperation } from '../../../settings/redux/overview/reallocationOfPlanning/thunks';
import { ReallocationData } from '../useReallocationOfPlanningModal';
import warningIcon from '@/assets/warning.svg';

interface ReallocationConfirmationModalProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  reallocationData: ReallocationData;
  reallocationSubmittedCallback: () => void;
}

export const ReallocationConfirmationModal = ({
  isOpen,
  setIsOpen,
  reallocationData,
  reallocationSubmittedCallback,
}: ReallocationConfirmationModalProps): JSX.Element => {
  const dispatch = useAppDispatch();

  const { translate } = useTranslate({
    ns: 'reallocationOfPlanning',
  });

  const closeModal = useCallback((): void => {
    setIsOpen(false);
  }, [setIsOpen]);

  const onSubmit = () => {
    dispatch(reallocateOperation(reallocationData));
    reallocationSubmittedCallback();
  };

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
      cancelText={translate('cancel')}
      onCancel={closeModal}
      closable={false}
    >
      <div className='confirm-modal-content'>
        <img src={warningIcon} alt={'warning'} />
        <span>{translate('allocation_confirm_message')}</span>
      </div>
    </Modal>
  );

  return modal;
};
