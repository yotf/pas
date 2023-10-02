/**
 * @module SimulationActions
 */

import CustomButton from '@/modules/shared/components/button/button.component';
import CustomInput from '@/modules/shared/components/input/input.component';
import { useTranslate } from '@/modules/shared/hooks/translate.hook';
import { nameofFactory } from '@/modules/shared/utils/utils';
import { useAppDispatch } from '@/store/hooks';
import dayjs from 'dayjs';
import { FC } from 'react';
import { useFormContext, UseFormReturn } from 'react-hook-form';
import { SimulationFormData } from '../../settings/redux/simulation/interfaces';
import { getSimulationData } from '../../settings/redux/simulation/thunks';
/**
 *
 * @returns Simulation actions component. It uses form created by {@link SimulationPage} and renders the button used for sending API request if the form is valid
 */
const SimulationActions: FC = (): JSX.Element => {
  const dispatch = useAppDispatch();

  const { translate } = useTranslate({ ns: 'simulation' });

  const nameof = nameofFactory<SimulationFormData>();

  const form: UseFormReturn<SimulationFormData, any> = useFormContext();

  const {
    getValues,
    formState: { isDirty, isValid, isSubmitting },
    watch,
  } = form;

  const { initialDate } = watch();

  const getSimulations = (): void => {
    let formData = getValues();
    formData.routings.forEach((obj) => {
      delete obj['routingDeliveryDate'];
    });

    dispatch(getSimulationData(formData));
  };

  return (
    <div className='generate'>
      <CustomInput
        type='date'
        isRequired={true}
        label={translate('initialDate')}
        name={nameof('initialDate')}
        //  width='full-width'
        noPastDates={true}
      />

      <CustomInput
        type='date'
        isRequired={true}
        label={translate('finalDate')}
        name={nameof('finalDate')}
        // width='full-width'
        disableDatesFrom={dayjs(initialDate)}
      />
      <div className='button-container'>
        <CustomButton
          type='button'
          color='blue'
          isDisabled={!isValid || !isDirty || isSubmitting}
          onClick={getSimulations}
        >
          <div className='button-children'>
            <span>{translate('generate_data')}</span>
          </div>
        </CustomButton>
      </div>
    </div>
  );
};

export default SimulationActions;
