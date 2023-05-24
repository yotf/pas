/**
 * @module useRadioChangeModal
 */

import warningIcon from '@/assets/warning.svg';
import { useTranslate } from '@/modules/shared/hooks/translate.hook';
import { Modal } from 'antd';
import { useCallback, useRef, useState } from 'react';
import { UseFormReturn } from 'react-hook-form/dist/types';
import { WorkCenterFormData } from '../../settings/redux/workCenters/interfaces';

export type UseRadioChangeModalReturnType = {
  radioChangeModal: JSX.Element;
  openRadioChangeModal: (callback: () => void) => void;
};

export type UseRadioChangeModalProps = {
  ns: string;
  form: UseFormReturn<WorkCenterFormData>;
};
/**
 *
 * @returns Modal used for confirmation of user choice when changing allocationBased values from the form. Confirming clears all allowed operations from the state
 */
export const useRadioChangeModal = ({
  ns,
  form,
}: UseRadioChangeModalProps): UseRadioChangeModalReturnType => {
  const [isRadioChangeModalOpen, setIsRadioChangeModalOpen] = useState<boolean>(false);
  const callbackRef = useRef<() => void>();
  const { setValue } = form;
  const { translate } = useTranslate({
    ns: ns,
    keyPrefix: 'radio_modal',
  });

  const closeRedirectModal = useCallback((): void => {
    setIsRadioChangeModalOpen(false);
  }, []);
  const openRadioChangeModal = useCallback((callback: () => void): void => {
    callbackRef.current = callback;

    setIsRadioChangeModalOpen(true);
  }, []);

  const handleOk = useCallback((): void => {
    callbackRef.current!();
    setValue('allowedOperations', []);
    closeRedirectModal();
  }, [closeRedirectModal, setValue]);

  const radioChangeModal: JSX.Element = (
    <Modal
      centered
      open={isRadioChangeModalOpen}
      okText={translate('ok_text')}
      onOk={handleOk}
      cancelText={translate('cancel')}
      onCancel={closeRedirectModal}
      closable={false}
    >
      <div className='confirm-modal-content'>
        <img src={warningIcon} alt={'warning'} />
        <span>{translate('radio_modal_text')}</span>
      </div>
    </Modal>
  );

  return { radioChangeModal, openRadioChangeModal };
};
