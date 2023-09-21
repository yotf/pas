/**
 * @module StatisticsPage
 */

import CustomButton from '@/modules/shared/components/button/button.component';
import CustomInput from '@/modules/shared/components/input/input.component';
import { useTranslate } from '@/modules/shared/hooks/translate.hook';
import { nameofFactory } from '@/modules/shared/utils/utils';
import { useAppDispatch } from '@/store/hooks';
import dayjs from 'dayjs';
import { FC, useEffect } from 'react';
import { FormProvider } from 'react-hook-form';
import { StatisticsFormData } from '../settings/redux/statistics/interfaces';
import { clearStatistics } from '../settings/redux/statistics/slice';
import { getDelayedOrders, getStatistics } from '../settings/redux/statistics/thunks';
import { useDelayedOrders } from './hooks/useDelayedOrdersTable';
import { useStatisticsForms } from './hooks/useStatisticsForm';
import { useStatisticsOptions } from './hooks/useStatisticsOptions';
import { useStatisticsTable } from './hooks/useStatisticsTable';
import percent from '@/assets/icons/percent.svg';
import './statistics.scss';

const Statistics: FC = () => {
  const { workCenterOptions } = useStatisticsOptions();

  const nameof = nameofFactory<StatisticsFormData>();

  const { form, innerForm } = useStatisticsForms();

  const {
    getValues,
    watch,
    formState: { isValid },
    trigger,
  } = form;

  const { initialDate, finalDate } = watch();
  const { register } = innerForm;

  const { translate } = useTranslate({ ns: 'statistics' });

  const dispatch = useAppDispatch();

  const getStatisticsData = (): void => {
    dispatch(getStatistics(getValues()));
  };

  const getDelayedOrdersData = (): void => {
    dispatch(getDelayedOrders(getValues()));
  };

  const delayedOrdersTable = useDelayedOrders();

  const statisticsTable = useStatisticsTable();

  useEffect(() => {
    return () => {
      dispatch(clearStatistics());
    };
  }, [dispatch]);

  useEffect(() => {
    if (initialDate && finalDate) {
      trigger('finalDate');
      trigger('initialDate');
    }
  }, [finalDate, initialDate, trigger]);

  const selectAllWorkCenters = (e: any) => {
    form.setValue(
      'workCenters',
      workCenterOptions.map((wc) => Number(wc.value), {
        shouldValidate: true,
        shouldDirty: true,
        shouldTouch: true,
      }),
    );
    form.trigger('workCenters');
  };

  return (
    <FormProvider {...form}>
      <div className='title-container'>
        <h2 className='table-container__title'>{translate('title')}</h2>
        <div className='statistics-container'>
          <div className='workCenters'>
            <CustomInput
              isAutocomplete={true}
              type={'select'}
              label={translate('workCenters')}
              name={nameof('workCenters')}
              width='full-width'
              mode='multiple'
              options={workCenterOptions}
              isRequired={true}
              allowClear={true}
            />
            <CustomButton type='button' color='blue' onClick={selectAllWorkCenters}>
              <div className='button-children'>
                <span>{translate('select_all_work_centers')}</span>
              </div>
            </CustomButton>
          </div>
          <CustomInput
            type='date'
            isRequired={true}
            label={translate('initialDate')}
            name={nameof('initialDate')}
            width='full-width'
          />
          <CustomInput
            type='date'
            isRequired={true}
            label={translate('finalDate')}
            name={nameof('finalDate')}
            width='full-width'
            disableDatesFrom={dayjs(initialDate)}
          />
          <CustomButton
            type='button'
            color='blue'
            onClick={getStatisticsData}
            isDisabled={!isValid}
          >
            <div className='button-children'>
              <span>{translate('generate_statistics')}</span>
            </div>
          </CustomButton>
          <div className='heading'>
            <h2>{translate('general_overview')}</h2>
          </div>
          <div className='divider'></div>
          <CustomButton
            type='button'
            color='white'
            onClick={getDelayedOrdersData}
            isDisabled={!isValid}
          >
            <div className='button-children'>
              <span>{translate('delayed_orders')}</span>
            </div>
          </CustomButton>
          <FormProvider {...innerForm}>
            <CustomInput
              type='text'
              label={translate('numberOfSalesOrders')}
              placeholder={translate('numberOfSalesOrders')}
              register={register('numberOfSalesOrders')}
              disabled={true}
              readOnly={true}
            />
            <CustomInput
              type='text'
              label={translate('delayedSalesOrders')}
              placeholder={translate('delayedSalesOrders')}
              register={register('delayedSalesOrders')}
              disabled={true}
              readOnly={true}
            />
            <CustomInput
              type='text'
              label={translate('numberOfPO')}
              placeholder={translate('numberOfPO')}
              register={register('numberOfPO')}
              disabled={true}
              readOnly={true}
            />
            <CustomInput
              type='text'
              label={translate('delayedPO')}
              placeholder={translate('delayedPO')}
              register={register('delayedPO')}
              disabled={true}
              readOnly={true}
            />
            <CustomInput
              type='text'
              label={translate('occupancy')}
              placeholder={translate('occupancy')}
              register={register('occupancy')}
              disabled={true}
              readOnly={true}
              icon={percent}
              iconRight
            />
            <CustomInput
              type='text'
              label={translate('allocatedMinutes')}
              placeholder={translate('allocatedMinutes')}
              register={register('allocatedMinutes')}
              disabled={true}
              readOnly={true}
            />
            <CustomInput
              type='text'
              label={translate('setupMinutes')}
              placeholder={translate('setupMinutes')}
              register={register('setupMinutes')}
              disabled={true}
              readOnly={true}
            />
            <CustomInput
              type='text'
              label={translate('availableMinutes')}
              placeholder={translate('availableMinutes')}
              register={register('availableMinutes')}
              disabled={true}
              readOnly={true}
            />
          </FormProvider>
          <div className='table-container colored-columns'>{statisticsTable}</div>
          <h4 className='delayed-orders-header'>{translate('delayed_orders_heading')}</h4>
          <div className='table-container daleyed-order-table'>{delayedOrdersTable}</div>
        </div>
      </div>
    </FormProvider>
  );
};

export default Statistics;
