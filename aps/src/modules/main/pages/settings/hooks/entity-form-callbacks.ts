/**
 * @module EntityFormCallbacks
 */

import { AsyncThunkAction, CombinedState } from '@reduxjs/toolkit';
import { useCallback, useEffect, useRef } from 'react';
import { FieldValues, UseFormReturn } from 'react-hook-form';
import { StoreType } from '../../../../../store';
import { useAppDispatch, useAppSelector } from '../../../../../store/hooks';
import { useTranslate } from '../../../../shared/hooks/translate.hook';
import BaseResponse from '../../../../shared/services/interfaces';
import {
  notificationFail,
  notificationSuccess,
} from '../../../../shared/services/notification.service';
import { resetPagination } from '../redux/sharedTableState/slice';
import { AxiosErrorFormat } from '../redux/slice';

export type Callbacks = {
  handleOk: (close: () => void) => () => void;
  handleCancel: (close: () => void) => () => void;
};
export type UseEntityFormCallbackProps<T extends FieldValues, K> = {
  form: UseFormReturn<T, any>;
  ns: string;
  selector: (state: CombinedState<StoreType>) => K;
  upsertThunk: (data: T) => AsyncThunkAction<unknown, unknown, Record<string, unknown>>;
  callbackAfterSubmit?: () => void;
};
/**
 * @template T Type of entity used in modal and table
 * @template K Type of redux state
 * @param form RHF Form of type T. Contains methods like watch, setValue, setError etc.
 * @param ns Localization Namespace
 * @param selector Redux state of type K
 * @param upsertThunk Thunk that posts/puts data of type T
 * @param callbackAfterSubmit Additional callback that is called after submitting form data and calling the upsertThunk
 * @returns Callbacks handleOk and handleCancel used in {@link EntityModal} component
 * RHF handle submit method is used to get form values and pass them to the upsertThunk
 */
export const useEntityFormCallbacks = <T extends FieldValues, K extends BaseResponse>({
  form,
  ns,
  selector,
  upsertThunk,
  callbackAfterSubmit,
}: UseEntityFormCallbackProps<T, K>): Callbacks => {
  const {
    handleSubmit,
    formState: { isSubmitted },
  } = form;

  const dispatch = useAppDispatch();
  const { loading, error } = useAppSelector(selector);
  const onClose = useRef(() => {});

  const onSubmit = useCallback(
    async (data: T): Promise<void> => {
      await dispatch(upsertThunk(data));
      if (callbackAfterSubmit) callbackAfterSubmit();
      if (!error && !loading) dispatch(resetPagination());
    },
    [callbackAfterSubmit, dispatch, error, loading, upsertThunk],
  );

  const handleOk = useCallback(
    (close: () => void) => {
      onClose.current = close;
      return handleSubmit(onSubmit);
    },
    [handleSubmit, onSubmit],
  );
  const handleCancel = useCallback(
    (close: () => void) => () => {
      close();
    },
    [],
  );

  const { translate } = useTranslate({
    ns,
    keyPrefix: 'notification',
  });
  useEffect(() => {
    if (isSubmitted && !loading) {
      if (!error) {
        notificationSuccess(translate(form.getValues().id ? 'edit' : 'create'));
        onClose.current();
        form.reset();
      } else {
        if (ns === 'unit_of_measure') notificationFail(error);
        form.reset(undefined, {
          keepValues: !!error,
          keepErrors: !!error,
          keepDefaultValues: !!error,
          keepDirtyValues: !!error,
          keepDirty: !!error,
          keepIsValid: !!error,
          keepTouched: !!error,
        });
      }
    }
  }, [error, form, isSubmitted, loading, translate]);

  return { handleOk, handleCancel };
};
