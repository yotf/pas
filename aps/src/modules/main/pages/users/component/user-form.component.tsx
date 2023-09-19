/**
 * @module UserForm
 */

import { FC, useEffect, useMemo } from 'react';
import { useFormContext } from 'react-hook-form';
import CustomInput from '../../../../shared/components/input/input.component';
import CustomSwitch from '../../../../shared/components/input/switch/switch.component';
import { useTranslate } from '../../../../shared/hooks/translate.hook';
import { UserFormData } from '../../settings/redux/user/interfaces';
import { useUserOptions } from '../hooks/positions';
import { availableLanguages } from '@/localizations/i18n';
import './user-form.component.scss';
import { limitToNumericKeyDown } from '@/modules/shared/utils/utils';
/**
 *
 * @returns Form rendered inside the {@link UserModal}
 */
interface UserProps {
  user: UserFormData;
}
const UserForm: FC<UserProps> = ({ user }) => {
  const { translate } = useTranslate({
    ns: 'users',
    keyPrefix: 'form',
  });
  const {
    register,
    formState: { errors, isDirty },
    setValue,
    getValues,
    watch,
  } = useFormContext<UserFormData>();
  const { language, userName } = watch();
  //const { options: roleOptions } = useRoles();
  // const userPosition = getValues('positionId');

  const { positionOptions, roleOptions } = useUserOptions(user);

  const languageOptions = availableLanguages.map((lang) => ({
    label: translate(lang),
    value: lang,
  }));

  const preventEmptySpace = (
    event: React.KeyboardEvent<HTMLInputElement> | React.KeyboardEvent<HTMLTextAreaElement>,
  ): void => {
    if (event.key.includes(' ')) event.preventDefault();
  };

  useEffect(() => {
    if (!language) setValue('language', languageOptions?.[0]?.value);
  }, [language]);

  const languageChanged = useMemo(
    () => user.language && user.language !== language,
    [user, language],
  );

  return (
    <form
      className='settings-form'
      data-testid='user-form'
      autoComplete='off'
      onSubmit={(e): void => e.preventDefault()}
    >
      <CustomInput
        error={errors.firstName}
        type='text'
        label={translate('firstName')}
        placeholder={translate('firstName')}
        register={register('firstName')}
        isRequired={true}
        maxLength={20}
      />
      <CustomInput
        error={errors.lastName}
        type='text'
        label={translate('lastName')}
        placeholder={translate('lastName')}
        register={register('lastName')}
        maxLength={20}
        isRequired={true}
      />
      <CustomInput
        error={errors.userName}
        type='text'
        label={translate('username')}
        placeholder={translate('username')}
        register={register('userName')}
        isRequired={true}
        onKeyDownEvent={preventEmptySpace}
        maxLength={20}
      />
      <CustomInput
        error={errors.password}
        type='password'
        label={translate('password')}
        placeholder={translate('password')}
        register={register('password')}
        isRequired={!getValues('id')}
      />
      <CustomInput
        error={errors.email}
        type='email'
        label={translate('email')}
        placeholder={translate('email')}
        register={register('email')}
        isRequired={true}
        onKeyDownEvent={preventEmptySpace}
      />
      <CustomInput
        type='tel'
        error={errors.phoneNumber}
        label={translate('phone')}
        placeholder={translate('phone')}
        register={register('phoneNumber')}
        onKeyDownEvent={limitToNumericKeyDown}
        maxLength={20}
      />

      <CustomInput
        error={errors.roleId}
        type='select'
        label={translate('role')}
        placeholder={translate('role')}
        register={register('roleId')}
        options={roleOptions}
        isRequired={true}
      />
      <CustomInput
        error={errors.positionId}
        type='select'
        label={translate('position')}
        placeholder={translate('position')}
        register={register('positionId')}
        options={positionOptions}
      />
      <div className='switch-n-message'>
        <CustomSwitch label={translate('active')} name={register('isActive').name} />
        {languageChanged && (
          <span className='lang-change-message'>
            {translate('language-change-message', { username: user.userName })}
          </span>
        )}
      </div>
      <CustomInput
        error={errors.language}
        type='select'
        label={translate('language')}
        placeholder={translate('language')}
        register={register('language')}
        options={languageOptions}
        isRequired={true}
      />
    </form>
  );
};

export default UserForm;
