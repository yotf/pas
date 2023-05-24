/**
 * @module UseModalProps
 */

import { ButtonProps } from 'antd';
import { useMemo } from 'react';
import { UseFormReturn } from 'react-hook-form';

export type Return = {
  okButtonProps: ButtonProps;
  cancelButtonProps: ButtonProps;
};
/**
 *
 * @returns Props passed down to buttons in modals. The props make sure buttons are disabled if there are errors in the form.
 */
export const useModalProps = <T extends object>(form: UseFormReturn<T>): Return => {
  const {
    formState: { isSubmitted, isValid, isDirty, errors },
  } = form;
  const okButtonProps = useMemo(
    () => ({
      disabled: isSubmitted || !isValid || !!Object.keys(errors).length || !isDirty,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [Object.keys(errors).length, isDirty, isSubmitted, isValid],
  );
  const cancelButtonProps = useMemo(() => ({ disabled: isSubmitted }), [isSubmitted]);
  return { okButtonProps, cancelButtonProps };
};
