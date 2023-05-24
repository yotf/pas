/**
 * @module LoginHook
 */

import { Login } from '@/modules/auth/redux/interfaces';
import { loginThunk } from '@/modules/auth/redux/thunks';
import { Shape } from '@/modules/shared/yup/yup.schema';
import { useAppDispatch } from '@/store/hooks';
import { yupResolver } from '@hookform/resolvers/yup';
import { BaseSyntheticEvent, Dispatch, SetStateAction, useMemo } from 'react';
import { FormState, useForm, UseFormRegister, UseFormReturn } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import * as Yup from 'yup';

export interface LoginHookReturn {
  onSubmit: (e?: BaseSyntheticEvent<object, any, any> | undefined) => Promise<void>;
  /**
   * React Hook Form method used for registering an input inside of a form
   */
  register: UseFormRegister<Login>;
  /**
   * Form State extracted from RHF
   */
  formState: FormState<Login>;
  /**
   * Form from RHF
   */
  form: UseFormReturn<Login, any>;
}
/**
 *
 * @param setShowError accepted from the login page, used for reseting form errors
 * @param translate translate hook return value {@link useTranslate}
 * @returns Login validation schema and React Hook Form methods and callbacks needed for the {@link LoginPage}
 */
export const useLogin = (
  setShowError: Dispatch<SetStateAction<boolean>>,
  translate: (value: string, options?: Record<string, string>) => string,
): LoginHookReturn => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const validationSchema = useMemo(
    () =>
      Yup.object<Shape<Login>>({
        password: Yup.string().required(translate('validation.password')),
        userName: Yup.string().required(translate('validation.username')),
      }),
    [translate],
  );

  const form = useForm<Login>({
    resolver: yupResolver(validationSchema),
  });
  const { register, handleSubmit, setError, formState } = form;

  const onSubmit = handleSubmit(async (data) => {
    let status;
    try {
      const res = await dispatch(loginThunk(data));
      status = res?.meta?.requestStatus;
    } catch (error) {
      return { error: error };
    }
    if (status === 'rejected') {
      setShowError(true);
      setError('userName', {});
      setError('password', {});
    } else {
      navigate('/');
    }
  });

  return {
    onSubmit,
    register,
    formState,
    form,
  };
};
