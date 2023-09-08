import CustomInput from '@/modules/shared/components/input/input.component';
import { useTranslate } from '@/modules/shared/hooks/translate.hook';
import { FC } from 'react';
import { useFormContext } from 'react-hook-form';
import { SettingsPageItem } from '../settings/consts/interfaces';
import CustomSwitch from '@/modules/shared/components/input/switch/switch.component';
import { limitToNumericKeyDown } from '@/modules/shared/utils/utils';

const DepartmentForm: FC = () => {
  const { translate } = useTranslate({
    ns: 'department',
    keyPrefix: 'form',
  });
  const {
    register,
    formState: { errors },
  } = useFormContext<SettingsPageItem>();
  return (
    <form
      data-testid='department-form'
      className='settings-form'
      autoComplete='off'
      onSubmit={(e): void => e.preventDefault()}
    >
      <CustomInput
        error={errors.code}
        type='tel'
        label={translate('code')}
        placeholder={translate('code')}
        register={register('code')}
        isRequired={true}
        onKeyDownEvent={limitToNumericKeyDown}
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
      <CustomSwitch label={translate('active')} name={register('isActive').name} />
    </form>
  );
};

export default DepartmentForm;
