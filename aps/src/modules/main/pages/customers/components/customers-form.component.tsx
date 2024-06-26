/**
 * @module CustomersForm
 */

import CustomInput from '@/modules/shared/components/input/input.component';
import CustomSwitch from '@/modules/shared/components/input/switch/switch.component';
import { useTranslate } from '@/modules/shared/hooks/translate.hook';
import { FC } from 'react';
import { useFormContext } from 'react-hook-form';
import { SettingsPageItem } from '../../settings/consts/interfaces';
/**
 *
 *  Used instead of {@link SettingsForm} to add additional form fields to {@link SettingsModal}
 */
const CustomersForm: FC = () => {
  const { translate } = useTranslate({
    ns: 'customers',
    keyPrefix: 'form',
  });
  const {
    register,
    formState: { errors },
  } = useFormContext<SettingsPageItem>();
  return (
    <form
      data-testid='customers-form'
      className='settings-form'
      autoComplete='off'
      onSubmit={(e): void => e.preventDefault()}
    >
      <CustomInput
        error={errors.code}
        type='text'
        label={translate('code')}
        placeholder={translate('code')}
        register={register('code')}
        isRequired={true}
        maxLength={20}
      />
      <CustomInput
        error={errors.name}
        type='text'
        label={translate('name')}
        placeholder={translate('name')}
        register={register('name')}
        maxLength={50}
        isRequired={true}
      />
      <CustomInput
        error={errors.country}
        type='text'
        label={translate('country')}
        placeholder={translate('country')}
        register={register('country')}
        maxLength={50}
        isRequired={true}
      />
      <CustomSwitch label={translate('active')} name={register('isActive').name} />
    </form>
  );
};

export default CustomersForm;
