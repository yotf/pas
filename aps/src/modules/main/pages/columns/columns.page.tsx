import { FC } from 'react';
import { Controller, FormProvider, useForm } from 'react-hook-form';
//import { ColumnsConfigFormData } from './interfaces';
import { overviewTableColumns } from '@/modules/shared/consts';
import { Checkbox } from 'antd';
import CustomButton from '@/modules/shared/components/button/button.component';
import { useTranslate } from '@/modules/shared/hooks/translate.hook';
import save from '@/assets/icons/save.svg';
import { OverviewProductionOrderOperationMapped } from '../settings/redux/overview/interfaces';
import { ColumnVisible, OverviewColumnsForm } from './interfaces';
import { useAppDispatch } from '@/store/hooks';
import { postColumnsConfigThunk } from '../settings/redux/columns/thunks';
import { setLanguage } from '@/localizations/i18n';

const ColumnsConfig: FC = () => {
  const ns = 'columnConfig';
  const form = useForm<OverviewColumnsForm>();
  const dispatch = useAppDispatch();

 

  const { register, handleSubmit, control } = form;

  const { translate } = useTranslate({ ns: ns });

  const onSubmit = (data: OverviewColumnsForm) => {
    const visibilityList: ColumnVisible[] = Object.entries(data).map(([key, isVisible], index) => ({
      overviewColumnEnum: index,
      isVisible: isVisible || false,
    }));

    dispatch(postColumnsConfigThunk(visibilityList));
  };

  return (
    <FormProvider {...form}>
      <div className='columns-container'>
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
                  render={({ field }) => <Checkbox {...field} />}
                ></Controller>
                {otc}
              </label>
            </div>
          ))}
        </form>

        <CustomButton
          customClass='action-button'
          color='blue'
          type='button'
          //   isDisabled={isSaveDisabled}
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

export default ColumnsConfig;
