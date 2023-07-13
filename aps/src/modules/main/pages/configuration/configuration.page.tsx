import { FormProvider } from 'react-hook-form';
import { FC, useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import CustomInput from '@/modules/shared/components/input/input.component';
import { useTranslate } from '@/modules/shared/hooks/translate.hook';
import { mapDataToOptions, nameofFactory } from '@/modules/shared/utils/utils';
import { ConfigurationFormData } from './interfaces';
import { useConfigurationOptions } from './hooks/useConfigurationOptions';
import CustomButton from '@/modules/shared/components/button/button.component';
import save from '@/assets/icons/save.svg';

import './configuration.scss';
import { DefaultOptionType } from 'antd/lib/select';
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
  const { register, handleSubmit, setValue } = form;

  const { quantity1, quantity2, isKg } = form.watch();
  const { translate } = useTranslate({ ns: ns });

  useEffect(() => {
    const q1values = sliceState.quantities1.map((uom) => uom.unitOfMeasureId);
    const q2values = sliceState.quantities2.map((uom) => uom.unitOfMeasureId);
    const uomInKg = sliceState.quantities1.find((uom) => !!uom.isKg);
    setValue('quantity1', q1values);
    setValue('quantity2', q2values);
    setValue('isKg', uomInKg ? uomInKg.unitOfMeasureId : undefined);
  }, [sliceState]);

  useEffect(() => {
    if (isKg && !quantity1.includes(isKg)) setValue('isKg', undefined);
  }, [quantity1]);

  const nameof = nameofFactory<ConfigurationFormData>();

  const isSaveDisabled = useMemo(
    () => !quantity1?.length || !quantity2?.length,
    [quantity1, quantity2],
  );

  const quantityOptions = useConfigurationOptions();

  const radioOptions: DefaultOptionType[] = useMemo(
    () =>
      quantity1?.map((qid: number) => ({
        label: quantityOptions.find((opt) => opt.value === qid)?.label,
        value: qid,
      })),
    [quantity1],
  );

  const onSubmit = (data: ConfigurationFormData) => {
    const { quantity1, quantity2, isKg } = data;

    const quantity1UoMs = quantity1.map((qid) => ({
      unitOfMeasureId: qid,
      isKg: qid === isKg,
    }));

    const quantity2UoMs = quantity2.map((qid) => ({
      unitOfMeasureId: qid,
      isKg: false,
    }));

    dispatch(postConfigurationThunk({ quantities1: quantity1UoMs, quantities2: quantity2UoMs }));
  };

  // const onSubmit = useMemo(() => null, []); //TODO

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
            name={nameof('quantity1')}
            width='full-width'
            mode='multiple'
            options={quantityOptions}
            isRequired={true}
            allowClear={true}
          />
          {/* {quantity1?.map((uom) => ( */}
          <CustomInput
            type='select'
            label={translate('isKg')}
            name={nameof('isKg')}
            register={register('isKg')}
            options={radioOptions}
          />
          {/* ))} */}
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
