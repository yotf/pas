import { FormProvider } from 'react-hook-form';
import { FC, useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import CustomInput from '@/modules/shared/components/input/input.component';
import { useTranslate } from '@/modules/shared/hooks/translate.hook';
import { nameofFactory } from '@/modules/shared/utils/utils';
import { ConfigurationFormData } from './interfaces';
import { useConfigurationOptions } from './hooks/useConfigurationOptions';
import CustomButton from '@/modules/shared/components/button/button.component';
import save from '@/assets/icons/save.svg';

import './configuration.scss';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { getConfiguration, postConfigurationThunk } from '../settings/redux/configuration/thunks';
import { useConfigurationValidation } from './hooks/useConfigurationValidation';

const Configuration: FC = () => {
  const ns = 'configuration';
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(getConfiguration());
  }, [dispatch]);

  const sliceState = useAppSelector((state) => state.configuration.data);

  const form = useForm<ConfigurationFormData>();
  const {
    register,
    handleSubmit,
    setValue,
    formState: { isDirty },
  } = form;

  const { quantities1, quantities2, defaultKg } = form.watch();
  const { translate } = useTranslate({ ns: ns });

  useEffect(() => {
    const q1values = sliceState.quantities1.map((uom) => uom.unitOfMeasureId);
    const q2values = sliceState.quantities2.map((uom) => uom.unitOfMeasureId);
    const uomInKg = sliceState.defaultKg?.unitOfMeasureId;
    setValue('quantities1', q1values);
    setValue('quantities2', q2values);
    setValue('defaultKg', uomInKg);
  }, [sliceState]);

  const nameof = nameofFactory<ConfigurationFormData>();

  const isSaveDisabled = useMemo(
    () => !quantities1?.length || !quantities2?.length || !defaultKg || !isDirty,
    [quantities1, quantities2, defaultKg],
  );

  const { quantity1Options, quantity2Options, uomOptions } = useConfigurationOptions(sliceState);

  const onSubmit = (data: ConfigurationFormData) => {
    const { quantities1: quantity1, quantities2: quantity2, defaultKg } = data;

    const quantity1UoMs = quantity1.map((qid) => ({
      unitOfMeasureId: qid,
    }));

    const quantity2UoMs = quantity2.map((qid) => ({
      unitOfMeasureId: qid,
    }));

    dispatch(
      postConfigurationThunk({
        quantities1: quantity1UoMs,
        quantities2: quantity2UoMs,
        defaultKg: { unitOfMeasureId: defaultKg! },
      }),
    );
  };

  useConfigurationValidation({ form, ns });

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
            name={nameof('quantities1')}
            width='full-width'
            mode='multiple'
            options={quantity1Options}
            isRequired={true}
            allowClear={true}
          />
          {/* {quantity1?.map((uom) => ( */}
          <CustomInput
            type='select'
            label={translate('isKg')}
            name={nameof('defaultKg')}
            register={register('defaultKg')}
            options={uomOptions}
          />
          {/* ))} */}
          <CustomInput
            isAutocomplete={true}
            type={'select'}
            label={translate('quantity2')}
            name={nameof('quantities2')}
            width='full-width'
            mode='multiple'
            options={quantity2Options}
            isRequired={true}
            allowClear={true}
          />
        </form>

        <CustomButton
          customClass='action-button'
          color='blue'
          type='button'
          isDisabled={isSaveDisabled}
          onClick={handleSubmit(onSubmit)}
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
