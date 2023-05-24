/**
 * @module SimulationDataOverview
 */

import CustomInput from '@/modules/shared/components/input/input.component';
import { useTranslate } from '@/modules/shared/hooks/translate.hook';
import { nameofFactory } from '@/modules/shared/utils/utils';
import { FC } from 'react';
import { FormProvider, UseFormReturn } from 'react-hook-form';
import { DataOverview } from '../../settings/redux/simulation/interfaces';

export type SimulationDataOverviewProps = {
  form: UseFormReturn<DataOverview, any>;
  dataType: 'simulation' | 'real';
};
/**
 *
 * @param form RFH from {@link SimulationPage}. Defines which data is shown in the section.
 * @param dataType Defines how the title should be localized
 * @returns Simulation Overview component with inputs.
 */
const SimulationDataOverview: FC<SimulationDataOverviewProps> = ({
  form,
  dataType,
}): JSX.Element => {
  const { translate } = useTranslate({ ns: 'simulation' });

  const nameOfData = nameofFactory<DataOverview>();

  return (
    <div className='data'>
      <h3>{translate(`${dataType}_data_heading`)}</h3>
      <div className='data-grid'>
        <FormProvider {...form}>
          <CustomInput
            type='number'
            label={translate('occupancy')}
            placeholder={translate('occupancy')}
            name={nameOfData('occupancy')}
            readOnly={true}
          />
          <CustomInput
            type='number'
            label={translate('totalMinutes')}
            placeholder={translate('totalMinutes')}
            name={nameOfData('totalMinutes')}
            readOnly={true}
          />
          <div className='break'></div>
          <CustomInput
            type='number'
            label={translate('allocatedMinutes')}
            placeholder={translate('allocatedMinutes')}
            name={nameOfData('allocatedMinutes')}
            readOnly={true}
          />
          <CustomInput
            type='number'
            label={translate('minutes')}
            placeholder={translate('minutes')}
            name={nameOfData('minutes')}
            readOnly={true}
          />
          <CustomInput
            type='number'
            label={translate('availableMinutes')}
            placeholder={translate('availableMinutes')}
            name={nameOfData('availableMinutes')}
            readOnly={true}
          />
        </FormProvider>
      </div>
    </div>
  );
};

export default SimulationDataOverview;
