/**
 * @module ProductionCalendarInputs
 */

import copy from '@/assets/icons/copy.svg';
import CustomButton from '@/modules/shared/components/button/button.component';
import CustomInput from '@/modules/shared/components/input/input.component';
import { useTranslate } from '@/modules/shared/hooks/translate.hook';
import { nameofFactory } from '@/modules/shared/utils/utils';
import { FC } from 'react';
import { useFormContext } from 'react-hook-form';
import { GenerateProductionCalendarFormData } from '../../../settings/redux/productionCalendars/interfaces';
import { useProductionCalendarOptions } from '../../hooks/useProductionCalendarOptions';
import './productionCalendar-inputs.scss';
import { ProductionCalendarPostResponse } from '../../../settings/redux/productionCalendarsWorkCapacities/interfaces';

export type ProductionCalendarInputsProps = {
  checking: boolean;
  ns: string;
  exportToExcel?: () => void;
  entity?: ProductionCalendarPostResponse[];
};
/**
 *
 * @param checking If true, inputs are not editable. Used in {@link ProductionCalendarsChecking} page
 * @returns Inputs used in {@link ProductionCalendarsMaintain} and {@link ProductionCalendarsChecking} pages connected to {@link useGenerateProductionCalendarForm | form}.
 */
export const ProductionCalendarInputs: FC<ProductionCalendarInputsProps> = ({
  checking,
  ns,
  exportToExcel,
  entity,
}: ProductionCalendarInputsProps) => {
  const nameof = nameofFactory<GenerateProductionCalendarFormData>();

  const { translate } = useTranslate({ ns });

  const { workCenterOptions } = useProductionCalendarOptions(entity);
  const form = useFormContext();
  const { initialDate, finalDate } = form.watch();

  return (
    <div className={'top-section' + (!checking ? ' new' : '')}>
      <div className='page-inputs'>
        <CustomInput
          isAutocomplete={true}
          type={'select'}
          label={translate('workCenterIds')}
          name={nameof('workCenterIds')}
          width='full-width'
          mode='multiple'
          options={workCenterOptions}
          disabled={checking}
          isRequired={!checking}
          allowClear={true}
          listHeight={320}
        />

        <CustomInput
          type={'date'}
          label={translate('initialDate')}
          isRequired={!checking}
          name={nameof('initialDate')}
          width='full-width'
          noPastDates={true}
          disableDatesAfter={finalDate}
          disabled={checking}
        />

        <CustomInput
          type={'date'}
          label={translate('finalDate')}
          isRequired={!checking}
          name={nameof('finalDate')}
          width='full-width'
          disableDatesFrom={initialDate}
          disabled={checking}
        />
      </div>
      <CustomButton type='button' color='green' onClick={exportToExcel}>
        <div className='button-children'>
          <img src={copy} alt='' />
          <span>{translate('excel_button')}</span>
        </div>
      </CustomButton>
    </div>
  );
};
