/**
 * @module SimulationRoutings
 */

import CustomButton from '@/modules/shared/components/button/button.component';
import { useTranslate } from '@/modules/shared/hooks/translate.hook';
import { FC, useCallback } from 'react';
import { FieldError, useFieldArray, useFormContext, UseFormReturn } from 'react-hook-form';
import { RoutingInputs, SimulationFormData } from '../../settings/redux/simulation/interfaces';
import { emptyRouting } from '../emptyRouting';
import SimulationRouting from './simulationRouting';
/**
 *
 * @returns Simulation routings component which definces logic for creating, removing and updating simulation routings.
 * Routings are initially empty and defined in {@link SimulationPage}. The user can add a new {@link EmptyRouting | Empty Routing } and fill its values.
 * Each routing is represented by a {@link SimulationRouting} component
 */
const SimulationRoutings: FC = (): JSX.Element => {
  const form: UseFormReturn<SimulationFormData, any> = useFormContext();

  const { translate } = useTranslate({ ns: 'simulation' });

  const {
    control,
    formState: { errors },
    setValue,
    watch,
  } = form;

  const { routings } = watch();

  const { fields, remove } = useFieldArray({
    control,
    name: 'routings',
    keyName: 'fieldId',
  });

  const getLabels = useCallback(
    (_: number, string: keyof RoutingInputs): string | undefined => {
      return translate(string);
    },
    [translate],
  );

  const getRoutingErrors = useCallback(
    (index: number, property: keyof RoutingInputs): FieldError | undefined => {
      return errors.routings ? errors?.routings[index]?.[property] : undefined;
    },
    [JSON.stringify(errors.routings)],
  );

  return (
    <div className='routing-inputs'>
      {fields.map((field, index) => {
        return (
          <SimulationRouting
            key={field.fieldId}
            index={index}
            fieldsLength={fields.length}
            getRoutingErrors={getRoutingErrors}
            getRoutingLabel={getLabels}
            remove={remove}
            translate={translate}
          />
        );
      })}
      <CustomButton
        type='button'
        color='blue'
        onClick={(): void => {
          setValue('routings', [...routings, emptyRouting]);
        }}
      >
        <div className='button-children'>
          <span>{translate('add_routing')}</span>
        </div>
      </CustomButton>
    </div>
  );
};

export default SimulationRoutings;
