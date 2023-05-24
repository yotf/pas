/**
 * @module useValidationChecks
 */

import { useContext, useEffect } from 'react';
import { useFormContext } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useTranslate } from '../../../../shared/hooks/translate.hook';
import {
  notificationFail,
  notificationSuccess,
} from '../../../../shared/services/notification.service';
import { MaintainContext } from '../contexts/maintain.context';
/**
 * Validates if requests sent by a maintain page were successful or an error occured.
 * The hook uses {@link MaintainContext | Maintain Context} values  to watch the redux state provided inside the context.
 * Renders {@link CustomNotification | notifications} to inform the user about the end result.
 */
export const useValidationChecks = (): void => {
  const {
    ns,
    state: { loading, error, validationErrors },
    useDifferentChecks,
  } = useContext(MaintainContext);
  const navigate = useNavigate();
  const {
    formState: { isSubmitted },
    watch,
    reset,
  } = useFormContext();
  const { translate } = useTranslate({ ns, keyPrefix: 'validation' });

  const { id } = watch();

  useEffect(() => {
    if (useDifferentChecks) return;
    if (!isSubmitted || loading) {
      return;
    }

    if (error !== 'Rejected') {
      notificationFail(translate('create_fail'));
    }

    if (error === 'Rejected' && !validationErrors?.length) {
      notificationFail(translate('rejected_fail'));
    }

    if (error || validationErrors) {
      reset(undefined, {
        keepIsSubmitted: false,
        keepValues: true,
      });
      return;
    }

    notificationSuccess(translate(id ? 'edit_success' : 'create_success'));
    navigate('..');
  }, [
    error,
    id,
    isSubmitted,
    loading,
    navigate,
    reset,
    translate,
    useDifferentChecks,
    validationErrors,
  ]);
};

export default useValidationChecks;
