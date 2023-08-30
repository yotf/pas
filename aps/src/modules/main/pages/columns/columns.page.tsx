import { FC, useEffect } from 'react';
import { Controller, FormProvider, useForm } from 'react-hook-form';
//import { ColumnsConfigFormData } from './interfaces';
import { overviewTableColumns } from '@/modules/shared/consts';
import { Checkbox } from 'antd';
import CustomButton from '@/modules/shared/components/button/button.component';
import { useTranslate } from '@/modules/shared/hooks/translate.hook';
import save from '@/assets/icons/save.svg';
import { OverviewProductionOrderOperationMapped } from '../settings/redux/overview/interfaces';
import { ColumnVisible, OverviewColumnsForm } from './interfaces';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { getOverviewColumns, postColumnsConfigThunk } from '../settings/redux/columns/thunks';
import './columns.scss';
import {
  notificationFail,
  notificationSuccess,
} from '@/modules/shared/services/notification.service';

const ColumnsConfig: FC = () => {
  const ns = 'columnConfig';

  const dispatch = useAppDispatch();
  const { data: overViewColumns, error, loading } = useAppSelector((state) => state.columnConfig);

  const form = useForm<OverviewColumnsForm>();

  const {
    handleSubmit,
    control,
    formState: { isDirty, isSubmitted },
    setValue,
  } = form;

  useEffect(() => {
    overviewTableColumns.forEach((columnName, i) => {
      setValue(columnName, overViewColumns?.find((oc) => oc.overviewColumnEnum === i)?.isVisible);
    });
  }, [overViewColumns]);

  const { translate } = useTranslate({ ns: ns });

  useEffect(() => {
    dispatch(getOverviewColumns());
  }, [dispatch]);

  useEffect(() => {
    if (!isSubmitted || loading) return;
    if (error) {
      notificationFail(error);
      return;
    }
    notificationSuccess(translate('edit_success'));
  }, [error, loading, isSubmitted, translate]);

  const onSubmit = (data: OverviewColumnsForm) => {
    debugger;
    const visibilityList: ColumnVisible[] = Object.entries(data).map(([key, isVisible], index) => ({
      overviewColumnEnum: index,
      isVisible: isVisible || false,
    }));

    dispatch(postColumnsConfigThunk(visibilityList));
  };

  return (
    <FormProvider {...form}>
      <div className='columns-container'>
        <div className='overview'>
          <h2>{translate('overview')}</h2>
          <form
            className='columns-form'
            data-testid='columns-form'
            onSubmit={(e) => e.preventDefault()}
          >
            {overviewTableColumns.map((otc, i) => (
              <div>
                <label>
                  <Controller
                    control={control}
                    name={otc}
                    render={({ field }) => {
                      return (
                        <Checkbox
                          checked={
                            field.value
                            // field.value !== undefined
                            //   ? field.value
                            //   : overViewColumns?.[i]?.isVisible
                          }
                          {...field}
                        />
                      );
                    }}
                  ></Controller>
                  {translate(otc)}
                </label>
              </div>
            ))}
          </form>
        </div>

        <CustomButton
          customClass='action-button'
          color='blue'
          type='button'
          //   isDisabled={isSaveDisabled}
          onClick={handleSubmit(onSubmit)}
          isDisabled={!isDirty}
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

export default ColumnsConfig;
