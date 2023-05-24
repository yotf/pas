/**
 * @module UseRedirectModal
 */

import warningIcon from '@/assets/warning.svg';
import { useTranslate } from '@/modules/shared/hooks/translate.hook';
import { Modal } from 'antd';
import { useCallback, useRef, useState } from 'react';

export type UseRedirectModalReturnType = {
  redirectModal: JSX.Element;
  openRedirectModal: (callback: () => void, copyRedirect?: boolean) => void;
};

export type UseRedirectModalProps = {
  isDirty: boolean;
};
/**
 *
 * @param isDirty Accepted from a RHF form, indicates whether form values have been changed or not
 * @returns A redirect modal component and a function for opening it. The function for opening accepts a callback which will be triggered immediately if form is not dirty.
 * If the form is dirty, callback will be triggered when pressing the Proceed button on the modal.
 * The copy redirect param makes the modal usable when the user tries to leave the page and go to a copy page.
 */
export const useRedirectModal = ({
  isDirty,
}: UseRedirectModalProps): UseRedirectModalReturnType => {
  const [isRedirectModalOpen, setIsRedirectModalOpen] = useState<boolean>(false);
  const callbackRef = useRef<() => void>();
  const [copyModal, setCopyModal] = useState<boolean>(false);

  const { translate } = useTranslate({
    ns: 'redirect',
  });

  const closeRedirectModal = useCallback((): void => {
    setIsRedirectModalOpen(false);
  }, []);
  const openRedirectModal = useCallback(
    (callback: () => void, copyRedirect?: boolean): void => {
      callbackRef.current = callback;
      setCopyModal(!!copyRedirect);
      if (isDirty || copyRedirect) {
        setIsRedirectModalOpen(true);
      } else {
        callback();
      }
    },
    [isDirty],
  );

  const handleOk = useCallback((): void => {
    callbackRef.current!();
    closeRedirectModal();
  }, [closeRedirectModal]);

  const redirectModal: JSX.Element = (
    <Modal
      centered
      open={isRedirectModalOpen}
      okText={translate('ok_text')}
      onOk={handleOk}
      cancelText={translate('cancel')}
      onCancel={closeRedirectModal}
      closable={false}
    >
      <div className='confirm-modal-content'>
        <img src={warningIcon} alt={'warning'} />
        <span>{copyModal ? translate('copy_modal_text') : translate('redirect_modal_text')}</span>
      </div>
    </Modal>
  );

  return { redirectModal, openRedirectModal };
};
