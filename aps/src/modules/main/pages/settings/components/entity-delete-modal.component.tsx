/**
 * @module EntityDeleteModal
 */

import warningIcon from '@/assets/warning.svg';
import { AsyncThunkAction } from '@reduxjs/toolkit';
import { Modal } from 'antd';
import { ReactElement, useCallback, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../../../../../store/hooks';
import { useTranslate } from '../../../../shared/hooks/translate.hook';
import BaseResponse from '../../../../shared/services/interfaces';
import {
  notificationFail,
  notificationSuccess,
} from '../../../../shared/services/notification.service';
import { IdentifiableEntity, IdType } from '../redux/thunks';
import './entity-delete-modal.component.scss';
import { AxiosErrorFormat } from '../redux/slice';

export type EntityDeleteModalProps<E extends IdentifiableEntity, T extends BaseResponse> = {
  isOpen: boolean;
  onClose: () => void;
  entity?: E;
  ns: string;
  state: T;
  deleteThunk: (id: any) => AsyncThunkAction<IdType, IdType, Record<string, unknown>>;
  getName: (entity: E) => string;
};
/**
 * @template E Type of entity to be deleted. Needs to have an id.
 * @template T Type of state used by the modal
 * @param isOpen State that opens or closes the modal
 * @param onClose Callback called when the modal closes
 * @param entity Type E entity used in the modal
 * @param ns Localization Namespace
 * @param state Redux state used in the modal
 * @param delete Sends an API request for deleting an entity of type E
 * @param getName Name of IdentifiableEntity that will be deleted.
 * @returns A modal for deleting an existing entity of type E
 */
const EntityDeleteModal = <E extends IdentifiableEntity, T extends BaseResponse>({
  isOpen,
  onClose,
  entity,
  ns,
  state,
  deleteThunk,
  getName,
}: EntityDeleteModalProps<E, T>): ReactElement => {
  const { translate: modalTranslate } = useTranslate({
    ns,
    keyPrefix: 'modal',
  });
  const { translate: notificationTranslate } = useTranslate({
    ns,
    keyPrefix: 'notification',
  });
  const [isDeleting, setIsDeleting] = useState(false);
  const { loading, error } = state;
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const onConfirm = useCallback(() => {
    if (entity) {
      setIsDeleting(true);
      dispatch(deleteThunk(entity?.id));
    }
  }, [deleteThunk, dispatch, entity]);

  useEffect(() => {
    setIsDeleting(false);
  }, [entity]);

  useEffect(() => {
    if (isDeleting && !loading) {
      setIsDeleting(false);
      onClose();
      if (error) {
        notificationFail(
          (error as unknown as AxiosErrorFormat).data ?? notificationTranslate('delete_fail'),
        );
      } else {
        notificationSuccess(notificationTranslate('delete_success'));
        if (location.pathname.includes('edit')) navigate(-1);
      }
    }
  }, [error, isDeleting, loading, location.pathname, navigate, notificationTranslate, onClose]);

  return (
    <Modal
      centered
      open={isOpen}
      okText={modalTranslate('confirm')}
      okButtonProps={{ disabled: isDeleting }}
      onOk={onConfirm}
      cancelText={modalTranslate('decline')}
      cancelButtonProps={{ disabled: isDeleting }}
      onCancel={onClose}
      closable={false}
    >
      {entity && (
        <div className='confirm-modal-content'>
          <img src={warningIcon} alt={modalTranslate('warning')} />
          <span>{modalTranslate('delete_text', { name: getName(entity!) })}</span>
        </div>
      )}
    </Modal>
  );
};

export default EntityDeleteModal;
