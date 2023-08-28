/**
 * @module useRadioChangeModal
 */

import warningIcon from '@/assets/warning.svg';
import { useTranslate } from '@/modules/shared/hooks/translate.hook';
import { Button, Modal } from 'antd';
import { useCallback, useRef, useState } from 'react';
import { UseFormReturn } from 'react-hook-form/dist/types';
import { WorkCenterFormData } from '../../settings/redux/workCenters/interfaces';
import { InfoCircleOutlined } from '@ant-design/icons';
import './radioChangeModal.scss';

export type UseRadioChangeModalReturnType = {
  radioChangeModal: JSX.Element;
  openRadioChangeModal: (callback: () => void) => void;
};

export type UseRadioChangeModalProps = {
  ns: string;
  form: UseFormReturn<WorkCenterFormData>;
  usedInPlanning: boolean;
};
/**
 *
 * @returns Modal used for confirmation of user choice when changing allocationBased values from the form. Confirming clears all allowed operations from the state
 */
export const useRadioChangeModal = ({
  ns,
  form,
  usedInPlanning,
}: UseRadioChangeModalProps): UseRadioChangeModalReturnType => {
  const [isRadioChangeModalOpen, setIsRadioChangeModalOpen] = useState<boolean>(false);
  const callbackRef = useRef<() => void>();
  const { setValue, getValues } = form;
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
    setValue('unitOfMeasureId', undefined);
    closeRedirectModal();
  }, [closeRedirectModal, setValue]);

  const radioCanChangeModal: JSX.Element = (
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

  const radioCantChangeModal: JSX.Element = (
    <Modal
      centered
      okText='OK'
      open={isRadioChangeModalOpen}
      closable={true}
      footer={null}
      onCancel={closeRedirectModal}
    >
      <div className='confirm-modal-content info'>
        <InfoCircleOutlined style={{ color: '#749efa', fontSize: '16px' }} />
        <span>{translate('radio_cant_change_text')}</span>
      </div>
    </Modal>
  );

  const radioChangeModal = usedInPlanning ? radioCantChangeModal : radioCanChangeModal;

  return { radioChangeModal, openRadioChangeModal };
};
