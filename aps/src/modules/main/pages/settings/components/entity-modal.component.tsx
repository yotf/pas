/**
 * @module EntityModal
 */

import { AsyncThunkAction, CombinedState } from '@reduxjs/toolkit';
import { Modal } from 'antd';
import { PropsWithChildren, ReactElement } from 'react';
import { FieldValues, useFormContext } from 'react-hook-form';
import { OptionalObjectSchema, TypeOfShape } from 'yup/lib/object';
import { AnyObject } from 'yup/lib/types';
import { StoreType } from '../../../../../store';
import { useTranslate } from '../../../../shared/hooks/translate.hook';
import BaseResponse from '../../../../shared/services/interfaces';
import { Shape } from '../../../../shared/yup/yup.schema';
import { useEntityFormCallbacks } from '../hooks/entity-form-callbacks';

export type EntityModalProps<T, K> = PropsWithChildren & {
  isOpen: boolean;
  onClose: () => void;
  entity?: T;
  ns: string;
  validationSchema: OptionalObjectSchema<Shape<T>, AnyObject, TypeOfShape<Shape<T>>>;
  selector: (state: CombinedState<StoreType>) => K;
  upsertThunk: (data: T) => AsyncThunkAction<unknown, unknown, Record<string, unknown>>;
  callbackAfterSubmit?: () => void;
};
/**
 * @template T Type of entity to be created/edited
 * @template K Type of state used by the modal
 * @param isOpen State that opens or closes the modal
 * @param onClose Callback called when the modal closes
 * @param entity Type T entity used in the modal
 * @param ns Localization Namespace
 * @param selector Redux state used in the modal
 * @param upsertThunk Thunk that posts/puts data of type T
 * @param callbackAfterSubmit Additional callback that is called after submitting form data and calling the upsertThunk
 * @returns A modal for creating a new or editing an existing entity of type T. Used in settings pages
 */
const EntityModal = <T extends FieldValues, K extends BaseResponse>({
  isOpen,
  onClose,
  entity,
  ns,
  selector,
  upsertThunk,
  children,
  callbackAfterSubmit,
}: EntityModalProps<T, K>): ReactElement => {
  const { translate } = useTranslate({
    ns,
    keyPrefix: 'modal',
  });
  const form = useFormContext<T>();
  const { handleOk, handleCancel } = useEntityFormCallbacks({
    form,
    ns,
    selector,
    upsertThunk,
    callbackAfterSubmit,
  });
  const {
    formState: { errors, isValid, isDirty, isSubmitted },
  } = form;
  return (
    <Modal
      centered
      open={isOpen}
      title={entity?.id ? translate('edit_title') : translate('create_title')}
      okText={translate('save')}
      okButtonProps={{
        disabled: isSubmitted || !isValid || !!Object.keys(errors).length || !isDirty,
      }}
      onOk={handleOk(onClose)}
      cancelText={translate('cancel')}
      cancelButtonProps={{ disabled: isSubmitted }}
      onCancel={handleCancel(onClose)}
    >
      {children}
    </Modal>
  );
};

export default EntityModal;
