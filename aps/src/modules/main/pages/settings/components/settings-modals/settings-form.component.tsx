/**
 * @module SettingsForm
 */

import CustomInput from '@/modules/shared/components/input/input.component';
import CustomSwitch from '@/modules/shared/components/input/switch/switch.component';
import { useTranslate } from '@/modules/shared/hooks/translate.hook';
import { FC } from 'react';
import { useFormContext } from 'react-hook-form';
import { SettingsPageItem } from '../../consts/interfaces';
/**
 *
 * @returns  A {@link SettingsModal | Settings Page Modal } default form.
 * Used in most Settings Page Modal.
 * Passing a different form to a Settings Page Modal is needed if the entity used has additional properties (eg. country, holidayDate, unit)
 */
const SettingsForm: FC = () => {
  const { translate } = useTranslate({
    ns: 'settings',
    keyPrefix: 'form',
  });
  const {
    register,
    formState: { errors },
  } = useFormContext<SettingsPageItem>();
  return (
    <form
      className='settings-form'
      data-testid='settings-form'
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
      />
      <CustomInput
        error={errors.name}
        type='text'
        label={translate('name')}
        placeholder={translate('name')}
        register={register('name')}
        isRequired={true}
      />
      <CustomSwitch label={translate('active')} name={register('isActive').name} />
    </form>
  );
};

export default SettingsForm;
