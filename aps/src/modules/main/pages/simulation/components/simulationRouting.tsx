/**
 * @module SimulationRouting
 */

import CustomInput from '@/modules/shared/components/input/input.component';
import { limitToNumericKeyDown, onKeydownEvent } from '@/modules/shared/utils/utils';
import { DeleteOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import { FC } from 'react';
import { FieldError, UseFieldArrayRemove } from 'react-hook-form';
import { RoutingInputs } from '../../settings/redux/simulation/interfaces';
import { useSimulationOptions } from '../hooks/useSimulationOptions';

export type SimulationRoutingProps = {
  index: number;
  remove: UseFieldArrayRemove;
  fieldsLength: number;
  getRoutingLabel: (index: number, string: keyof RoutingInputs) => string | undefined;
  getRoutingErrors: (index: number, property: keyof RoutingInputs) => FieldError | undefined;
  translate: (value: string, options?: Record<string, string> | undefined) => string;
};
/**
 *
 * @returns One routing used in {@link SimulationRoutings } component
 * @param index Index of the routing. Used to track its values with useFieldArray hook from React Hook Form
 * @param remove Remove function for deleting a routing. Extracted from useFieldArray hook
 * @param fieldsLength Number of routings. Used for rendering layout
 * @param getRoutingLabel Returns routing label if the routing should have one
 * @param getRoutingErrors Returns routing error for each routing
 * @param translate Localization Function
 */
const SimulationRouting: FC<SimulationRoutingProps> = ({
  index,
  remove,
  fieldsLength,
  getRoutingLabel,
  getRoutingErrors,
  translate,
}: SimulationRoutingProps): JSX.Element => {
  const { routingOptions } = useSimulationOptions();

  return (
    <div className='routing'>
      <div className='routing-name'>
        <CustomInput
          type='select'
          label={getRoutingLabel(index, 'routingId')}
          placeholder={translate('routing_name')}
          width='full-width'
          options={routingOptions}
          name={`routings[${index}].routingId`}
          isAutocomplete={true}
          error={getRoutingErrors(index, 'routingId')}
          isRequired={true}
        />
      </div>
      <CustomInput
        type='tel'
        maxLength={4}
        label={getRoutingLabel(index, 'quantity')}
        placeholder={translate('quantity')}
        name={`routings[${index}].quantity`}
        error={getRoutingErrors(index, 'quantity')}
        onKeyDownEvent={limitToNumericKeyDown}
      />
      <CustomInput
        type='tel'
        maxLength={2}
        label={getRoutingLabel(index, 'numberOfPOs')}
        placeholder={translate('numberOfPOs')}
        name={`routings[${index}].numberOfPOs`}
        error={getRoutingErrors(index, 'numberOfPOs')}
        onKeyDownEvent={limitToNumericKeyDown}
      />
      <CustomInput
        type='tel'
        maxLength={2}
        label={getRoutingLabel(index, 'repeat')}
        placeholder={translate('repeat')}
        name={`routings[${index}].repeat`}
        error={getRoutingErrors(index, 'repeat')}
        onKeyDownEvent={limitToNumericKeyDown}
      />
      <div className='date-wrapper'>
        <div className='date-input'>
          <CustomInput
            type='date'
            isRequired={true}
            name={`routings[${index}].routingInitialDate`}
            label={getRoutingLabel(index, 'routingInitialDate')}
            placeholder={translate('initialDate')}
            width='full-width'
            noPastDates={true}
            disableDatesFrom={dayjs()}
            error={getRoutingErrors(index, 'routingInitialDate')}
          />
        </div>
        <div className='date-input'>
          <CustomInput
            type='date'
            name={`routings[${index}].routingDeliveryDate`}
            label={getRoutingLabel(index, 'routingDeliveryDate')}
            placeholder={translate('deliveryDate')}
            width='full-width'
            readOnly={true}
            disabled={true}
            error={getRoutingErrors(index, 'routingDeliveryDate')}
          />
        </div>
        <div className='delete-icon'>
          {fieldsLength > 1 && <DeleteOutlined onClick={(): void => remove(index)} />}
        </div>
      </div>
    </div>
  );
};

export default SimulationRouting;
