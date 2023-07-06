import { FormProvider } from 'react-hook-form';
import { FC, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import CustomInput from '@/modules/shared/components/input/input.component';
import { useTranslate } from '@/modules/shared/hooks/translate.hook';
import { nameofFactory } from '@/modules/shared/utils/utils';
import { ConfigurationFormData } from './interfaces';
import { useConfigurationOptions } from './hooks/useConfigurationOptions';
import CustomButton from '@/modules/shared/components/button/button.component';
import save from '@/assets/icons/save.svg';

import './configuration.scss';

const Configuration: FC = () => {
  const ns = 'configuration';

  const form = useForm<ConfigurationFormData>();
  const { quantity1, quantity2 } = form.watch();
  const { translate } = useTranslate({ ns: ns });

  const nameof = nameofFactory<ConfigurationFormData>();

  const isSaveDisabled = useMemo(
    () => !quantity1?.length || !quantity2?.length,
    [quantity1, quantity2],
  );

  const quantityOptions = useConfigurationOptions();

  const onSubmit = useMemo(() => null, []); //TODO

  return (
    <FormProvider {...form}>
      <div className='configuration-container'>

          <form
            className='configuration-form'
            data-testid='configuration-form'
            autoComplete='off'
            onSubmit={(e): void => e.preventDefault()}
          >
            <CustomInput
              isAutocomplete={true}
              type={'select'}
              label={translate('quantity1')}
              name={nameof('quantity1')}
              width='full-width'
              mode='multiple'
              options={quantityOptions}
              isRequired={true}
              allowClear={true}
            />
            <CustomInput
              isAutocomplete={true}
              type={'select'}
              label={translate('quantity2')}
              name={nameof('quantity2')}
              width='full-width'
              mode='multiple'
              options={quantityOptions}
              isRequired={true}
              allowClear={true}
            />
          </form>

        <CustomButton
          customClass='action-button'
          color='blue'
          type='button'
          isDisabled={isSaveDisabled}
          //  onClick={onSubmit}
        >
          <div className='button-children'>
            <img src={save} alt='' />
            <span>{translate('save')}</span>
          </div>
        </CustomButton>
      </div>
    </FormProvider>
  );
};

export default Configuration;
