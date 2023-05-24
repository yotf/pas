/**
 * @module useSimulationSchema
 */

import { Shape } from '@/modules/shared/yup/yup.schema';
import dayjs from 'dayjs';
import { useCallback, useMemo, useRef } from 'react';
import { Message } from 'react-hook-form';
import * as Yup from 'yup';
import { OptionalObjectSchema, TypeOfShape } from 'yup/lib/object';
import { AnyObject } from 'yup/lib/types';
import { useTranslate } from '../../../../shared/hooks/translate.hook';
import { RoutingInputs, SimulationFormData } from '../../settings/redux/simulation/interfaces';

type EntityShape = Shape<SimulationFormData>;
/**
 *  Schema used for {@link SimulationPage}. Validates user inputs and renders errors in case the values don't match the Schema rules
 */
export const useSimulationSchema = (): OptionalObjectSchema<
  EntityShape,
  AnyObject,
  TypeOfShape<EntityShape>
> => {
  const { translate } = useTranslate({
    ns: 'simulation',
    keyPrefix: 'validation',
  });

  type SingleRoutingForm = Shape<RoutingInputs>;

  const initialDateRef = useRef<string>('');
  const finalDateRef = useRef<string>('');

  const routingInitialDateValidation = (
    _: string | undefined,
    context: Yup.TestContext,
  ): boolean => {
    if (!initialDateRef.current) return true;
    const initialDate = dayjs(initialDateRef.current);
    const deliveryDate = dayjs(finalDateRef.current);
    return (
      !dayjs(context.parent.routingInitialDate).isBefore(initialDate, 'day') &&
      !dayjs(context.parent.routingInitialDate).isAfter(deliveryDate, 'day')
    );
  };

  const routingInitialDateValidator: {
    name: string;
    message: Message;
    test: Yup.TestFunction<string | undefined>;
  } = useMemo(
    () => ({
      name: '1',
      message: translate('initial_date_error'),
      test: routingInitialDateValidation,
    }),
    [translate],
  );

  const requiredNumber = useMemo(
    () =>
      Yup.number()
        .transform((value) => (isNaN(value) ? undefined : value))
        .required(translate('required')),
    [translate],
  );

  const maxLength = useCallback(
    (name: string, numberOfCharacters: number) => ({
      name: name,
      message: translate('max_length', { value: numberOfCharacters.toString() }),
      test: (value: number | undefined) =>
        (value === 0 || !!value) && value.toString().length <= numberOfCharacters,
    }),
    [translate],
  );

  const schema = useMemo(
    () =>
      Yup.object<Shape<Required<SimulationFormData>>>({
        initialDate: Yup.string()
          .required(translate('required'))
          .test({
            name: 'initialTest',
            message: translate('initial_date_lower'),
            test: (value, context) => {
              initialDateRef.current = value ?? '';
              const finalDate = context.parent.finalDate;
              if (!finalDate) return true;
              return !dayjs(finalDate).isBefore(dayjs(value), 'day');
            },
          }),

        finalDate: Yup.string()
          .required(translate('required'))
          .test({
            name: 'initialTest',
            message: '',
            test: (value) => {
              finalDateRef.current = value ?? '';
              return true;
            },
          }),

        routings: Yup.array(
          Yup.object<Shape<Required<RoutingInputs>>>({
            routingId: requiredNumber,
            numberOfPOs: requiredNumber.test(maxLength('numberOfPOs', 2)),
            quantity: requiredNumber.test(maxLength('quantity', 4)),
            repeat: requiredNumber.test(maxLength('repeat', 2)),
            routingDeliveryDate: Yup.string(),
            routingInitialDate: Yup.string()
              .required(translate('required'))
              .test(routingInitialDateValidator),
          }) as OptionalObjectSchema<SingleRoutingForm, AnyObject, TypeOfShape<SingleRoutingForm>>,
        ).notRequired() as unknown as Yup.AnyObjectSchema,
      }),
    [maxLength, requiredNumber, routingInitialDateValidator, translate],
  );
  return schema;
};
