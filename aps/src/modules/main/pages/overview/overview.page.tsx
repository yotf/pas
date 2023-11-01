/**
 * @module OverviewPage
 */

import copy from '@/assets/icons/copy.svg';
import CustomButton from '@/modules/shared/components/button/button.component';
import CustomInput from '@/modules/shared/components/input/input.component';
import { useTranslate } from '@/modules/shared/hooks/translate.hook';
import {
  exportToExcelFile,
  getDataForExcel,
  Sheet,
} from '@/modules/shared/utils/exportToExcel.utils';
import { limitToNumericKeyDown, nameofFactory } from '@/modules/shared/utils/utils';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { yupResolver } from '@hookform/resolvers/yup';
import dayjs from 'dayjs';
import { FC, useCallback, useEffect, useMemo } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { STATISTICS_PAGE } from '../../consts/pageRouter';
import {
  OverviewFormData,
  OverviewProductionOrderOperationMapped,
} from '../settings/redux/overview/interfaces';
import { clearData } from '../settings/redux/overview/slice';
import { getAllOverviewCenters } from '../settings/redux/overview/thunks';
import { StatisticsFormData } from '../settings/redux/statistics/interfaces';
import { OverviewTable } from './components/OverviewTable';
import { OverviewContextProvider } from './context/overview.context';
import { useMappedOverviewTables } from './hooks/useMappedOverviews';
import { useOverviewOptions } from './hooks/useOverviewOptions';
import { useOverviewSchema } from './hooks/useOverviewSchema';
import './overview.scss';
import { getOverviewColumns } from '../settings/redux/columns/thunks';
/**
 *
 * @returns Overview tables and form. Uses {@link useMappedOverviews} hook to split the data from the API and render it. Defines overview form and inputs and
 * their validation.
 */
const Overview: FC = () => {
  const { data, loading } = useAppSelector((state) => state.overview);

  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(getOverviewColumns());
  }, [dispatch]);

  const columnsOrder = useCallback(
    (): (keyof OverviewProductionOrderOperationMapped)[] => [
      'orderNumber',
      'orderType',
      'customerName',
      'salesOrderNumber',
      'materialName',
      'articleName',
      'colorName',
      'foreseenDeliveryDate',
      'quantity1',
      'unitOfMeasure1',
      'salesOrderDeliveryDate',
      'operationName',
      'operationId',
      'estimatedTime',
      'setupTime',
      'PODelivery',
      'POPosition',
      'calendarName',
    ],
    [],
  );

  const ns = 'overview';

  const { translate } = useTranslate({ ns: ns });

  const validationSchema = useOverviewSchema();
  const form = useForm<OverviewFormData>({
    resolver: yupResolver(validationSchema),
    mode: 'onBlur',
  });

  const nameof = nameofFactory<OverviewFormData>();

  const {
    watch,
    handleSubmit,
    trigger,
    formState: { isDirty, isValid, isSubmitted },
    getValues,
    setValue,
  } = form;

  const { initialDate, finalDate, workCenters } = watch();

  const { orderTypeOptions, workCenterOptions } = useOverviewOptions();

  const navigate = useNavigate();

  const getOverviewCenters = useCallback(
    async (filters: OverviewFormData): Promise<void> => {
      dispatch(getAllOverviewCenters(filters));
    },
    [dispatch],
  );

  const refreshOverview = useCallback(() => {
    getOverviewCenters(getValues());
  }, [getOverviewCenters, getValues]);

  const mappedTables = useMappedOverviewTables(data);

  useEffect(() => {
    if (initialDate && finalDate) {
      trigger('finalDate');
      trigger('initialDate');
    }
  }, [finalDate, initialDate, trigger]);

  // const maxAllowedWorkcenters = 10;

  // useEffect(() => {
  //   if (workCenters?.length === maxAllowedWorkcenters) trigger('workCenters');
  // }, [trigger, workCenters]);

  const goToStatistics = (): void => {
    navigate(STATISTICS_PAGE, {
      state: { initialDate, finalDate, workCenters } as StatisticsFormData,
    });
  };

  useEffect(() => {
    return () => {
      dispatch(clearData());
    };
  }, [dispatch]);

  const exportToExcel = useCallback(() => {
    const sheets: Sheet[] = mappedTables
      .filter((item) => item.tableData.length > 0)
      .map((item) => {
        return {
          sheetname: item.workCenterName.replace(/\//g, '-'),
          aoa_sheet_data: getDataForExcel(item.tableData, columnsOrder(), translate),
        } as Sheet;
      });

    exportToExcelFile({
      filename: translate('title'),
      sheets: sheets,
    });
  }, [columnsOrder, mappedTables, translate]);

  const selectAllWorkCenters = (e: any) => {
    setValue(
      'workCenters',
      workCenterOptions.map((wc) => Number(wc.value), {
        shouldValidate: true,
        shouldDirty: true,
        shouldTouch: true,
      }),
    );
    form.trigger('workCenters');
  };

  useEffect(() => {
    form.setValue('backlog', 0);
  }, []);

  const excelDisabled = useMemo(() => {
    return mappedTables?.length === 0 || !mappedTables.find((mt) => mt.tableData.length > 0);
  }, [mappedTables]);
  return (
    <FormProvider {...form}>
      {loading && isSubmitted && (
        <div className='spinner-overlay'>
          <div className='loader-container'>
            <span className='loader-20'></span>
          </div>
        </div>
      )}

      <OverviewContextProvider value={{ ns: ns, overviewFormData: getValues() }}>
        <div className='overview-container'>
          <h2 className='table-container__title'>{translate('title')}</h2>
          <div className='overview-inputs'>
            <CustomInput
              type='date'
              isRequired={true}
              label={translate('initialDate')}
              name={nameof('initialDate')}
              width='full-width'
              noPastDates={true}
            />
            <CustomInput
              type='date'
              isRequired={true}
              label={translate('finalDate')}
              name={nameof('finalDate')}
              width='full-width'
              disableDatesFrom={dayjs(initialDate)}
            />
            <div className='second-row'>
              <CustomInput
                type='select'
                label={translate('orderType')}
                name={nameof('orderType')}
                options={orderTypeOptions}
                isAutocomplete={true}
                width='full-width'
              />
            </div>
            <div className='po'>
              <CustomInput
                type='number'
                label={translate('productionOrder')}
                name={nameof('productionOrder')}
                width='full-width'
                disableDatesAfter={dayjs()}
              />
            </div>
            <div className='pending-days'>
              <CustomInput
                type='tel'
                pattern='[0-9]*'
                maxLength={2}
                label={translate('show-pending')}
                name={nameof('backlog')}
                onKeyDownEvent={limitToNumericKeyDown}
                width='full-width'
              />
            </div>

            <div className='break'></div>
            <div className='workCenters'>
              <div className='workcenterField'>
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
              </div>
              <div className='select-all-button'>
                <CustomButton type='button' color='blue' onClick={selectAllWorkCenters}>
                  <div className='button-children'>
                    <span>{translate('select_all_work_centers')}</span>
                  </div>
                </CustomButton>
              </div>
            </div>
            <div className='right-side'></div>

            <div className='overview-actions'>
              <CustomButton
                type='button'
                color='blue'
                onClick={handleSubmit(getOverviewCenters)}
                isDisabled={!isValid || !isDirty}
              >
                <div className='button-children'>
                  <span>{translate('display_work_centers')}</span>
                </div>
              </CustomButton>
              <div className='buttons-right'>
                <CustomButton
                  type='button'
                  color='white'
                  onClick={goToStatistics}
                  isDisabled={!isValid || !isValid}
                >
                  <div className='button-children'>
                    <span>{translate('statistics')}</span>
                  </div>
                </CustomButton>
                <CustomButton
                  type='button'
                  color='green'
                  onClick={exportToExcel}
                  isDisabled={excelDisabled}
                >
                  <div className='button-children'>
                    <img src={copy} alt='' />
                    <span>{translate('excel_button')}</span>
                  </div>
                </CustomButton>
              </div>
            </div>
          </div>

          {mappedTables.map((wc) => (
            <OverviewTable
              key={wc.workCenterName}
              overviewTableData={wc}
              translate={translate}
              refreshOverview={refreshOverview}
            />
          ))}
        </div>
      </OverviewContextProvider>
    </FormProvider>
  );
};

export default Overview;
