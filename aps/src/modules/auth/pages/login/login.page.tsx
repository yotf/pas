/**
 * @module LoginPage
 */

import CustomButton from '@/modules/shared/components/button/button.component';
import CustomInput from '@/modules/shared/components/input/input.component';
import CustomNotification from '@/modules/shared/components/notification/customNotification.component';
import { useTranslate } from '@/modules/shared/hooks/translate.hook';
import 'antd/dist/reset.css';
import { FC, useState } from 'react';
import { useLogin } from './hooks/login.hook';
import { FormProvider } from 'react-hook-form';
import './login.scss';

/**
 * Used for user authentication. Based on values the user enters inside the form, he is either redirected to the rest of the application or a notification is displayed using {@link CustomNotification} component.
 * The form logic is setup in the {@link LoginHook | useLogin} hook.
 * @returns Login Page
 */
const LoginPage: FC = () => {
  const { translate } = useTranslate({
    ns: 'login_form',
  });
  const [showError, setShowError] = useState(false);
  const {
    onSubmit,
    formState: { isDirty, errors, isSubmitting, isValid },
    register,
    form,
  } = useLogin(setShowError, translate);
  return (
    <FormProvider {...form}>
      <div data-testid='login' className='login-page'>
        <form className='login-form' onSubmit={onSubmit}>
          <CustomNotification
            setShowNotification={setShowError}
            message={translate('validation.wrong_credentials')}
            showNotification={showError}
          />
          <CustomInput
            error={errors.userName}
            type='text'
            label={translate('input.username')}
            placeholder={translate('input.placeholder_username')}
            register={register('userName')}
          />
          <CustomInput
            error={errors.password}
            type='password'
            label={translate('input.password')}
            placeholder={
              '\u2022 \u2022 \u2022 \u2022 \u2022 \u2022 \u2022 \u2022 \u2022 \u2022 \u2022'
            }
            register={register('password')}
          />
          <CustomButton
            isDisabled={!isValid || !isDirty}
            color='orange'
            type='submit'
            isLoading={isSubmitting}
          >
            <>{translate('button')}</>
          </CustomButton>
        </form>
      </div>
    </FormProvider>
  );
};
export default LoginPage;
