/**
 * @module UserForm
 */

import { FC } from 'react';
import { useFormContext } from 'react-hook-form';
import CustomInput from '../../../../shared/components/input/input.component';
import CustomSwitch from '../../../../shared/components/input/switch/switch.component';
import { useTranslate } from '../../../../shared/hooks/translate.hook';
import { UserFormData } from '../../settings/redux/user/interfaces';
import { useUserPositions } from '../hooks/positions';
import { useRoles } from '../hooks/roles';
/**
 *
 * @returns Form rendered inside the {@link UserModal}
 */
const UserForm: FC = () => {
  const { translate } = useTranslate({
    ns: 'users',
    keyPrefix: 'form',
  });
  const {
    register,
    formState: { errors },
    getValues,
  } = useFormContext<UserFormData>();
  const { options: roleOptions } = useRoles();
  const userPosition = getValues('positionId');

  const { options: positionOptions } = useUserPositions(userPosition);

  const preventEmptySpace = (event: React.KeyboardEvent<HTMLInputElement> | React.KeyboardEvent<HTMLTextAreaElement>): void => {
    if (event.key.includes(' ')) event.preventDefault();
  };

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
      />
      <CustomInput
        error={errors.lastName}
        type='text'
        label={translate('lastName')}
        placeholder={translate('lastName')}
        register={register('lastName')}
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
        error={errors.phoneNumber}
        type='text'
        label={translate('phone')}
        placeholder={translate('phone')}
        register={register('phoneNumber')}
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
      <CustomSwitch label={translate('active')} name={register('isActive').name} />
    </form>
  );
};

export default UserForm;
