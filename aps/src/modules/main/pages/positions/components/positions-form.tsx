/**
 * @module PositionsForm
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
const PositionsForm: FC = () => {
  const { translate } = useTranslate({
    ns: 'positions',
    keyPrefix: 'form',
  });
  const {
    register,
    formState: { errors },
  } = useFormContext<SettingsPageItem>();
  return (
    <form
      data-testid='positions-form'
      className='settings-form'
      autoComplete='off'
      onSubmit={(e): void => e.preventDefault()}
    >
      <CustomInput
        error={errors.name}
        type='text'
        label={translate('name')}
        placeholder={translate('name')}
        register={register('name')}
        isRequired={true}
        maxLength={30}
      />
      <CustomSwitch label={translate('active')} name={register('isActive').name} />
    </form>
  );
};

export default PositionsForm;
