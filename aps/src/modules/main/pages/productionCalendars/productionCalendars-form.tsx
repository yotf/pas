/**
 * @module ProductionCalendarsForm
 */

import CustomButton from '@/modules/shared/components/button/button.component';
import { useTranslate } from '@/modules/shared/hooks/translate.hook';
import { useAppDispatch } from '@/store/hooks';
import { FC, useContext, useMemo } from 'react';
import { FieldValues, useFormContext } from 'react-hook-form';
import {
  MaintainContext,
  MaintainContextValue,
} from '../../components/maintain/contexts/maintain.context';
import {
  GenerateProductionCalendarFormData,
  ProductionCalendar,
  ProductionCalendarFormData,
  ProductionCalendarResponse,
} from '../settings/redux/productionCalendars/interfaces';
import { generateProductionCalendar } from '../settings/redux/productionCalendarsWorkCapacities/thunks';
import { ProductionCalendarInputs } from './components/productionCalendarInputs/productionCalendar-inputs';
import { useHolidaysList } from './hooks/useHolidaysList';
import { useProductionCalendarValidationChecks } from './hooks/useProductionCalendarValidationChecks';
import { useWorkCapacitiesTable } from './hooks/useWorkCapacitiesTable';
import './productionCalendar-form.scss';
/**
 *
 * @returns Form used in {@link ProductionCalendarsMaintain } page. When a work center is selected, renders a {@link useWorkCapacitiesTable | Work Capacities table} with selected work centers capacities.
 * Renders holidays and  modal for creating a new holiday using {@link useHolidaysList}. User inputs are used for generating a new production calendar.
 */
const ProductionCalendarForm: FC = (): JSX.Element => {
  const { ns } =
    useContext<
      MaintainContextValue<
        ProductionCalendar,
        ProductionCalendarResponse,
        ProductionCalendarFormData
      >
    >(MaintainContext);
  const { translate } = useTranslate({ ns });

  const table = useWorkCapacitiesTable();
  const holidaysList = useHolidaysList(ns);

  const form = useFormContext();
  const {
    handleSubmit,
    formState: { isValid, isDirty },
  } = form;
  const dispatch = useAppDispatch();
  useProductionCalendarValidationChecks(ns);

  const onSubmit = useMemo(
    () =>
      handleSubmit(async (data: FieldValues): Promise<void> => {
        dispatch(generateProductionCalendar(data as GenerateProductionCalendarFormData));
      }),

    [dispatch, handleSubmit],
  );
  return (
    <form
      className='production-calendar-form'
      data-testid='production-calendar-form'
      autoComplete='off'
      onSubmit={(e): void => e.preventDefault()}
    >
      <ProductionCalendarInputs checking={false} ns={ns} />
      {table}
      {holidaysList}
      <CustomButton type='button' color='blue' onClick={onSubmit} isDisabled={!isValid || !isDirty}>
        <div className='button-children'>
          <span>{translate('generate_calendar')}</span>
        </div>
      </CustomButton>
    </form>
  );
};

export default ProductionCalendarForm;
