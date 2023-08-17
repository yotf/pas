/**
 * @module useHolidaysList
 */

import CustomButton from '@/modules/shared/components/button/button.component';
import CustomSwitch from '@/modules/shared/components/input/switch/switch.component';
import { useTranslate } from '@/modules/shared/hooks/translate.hook';
import { dateFormatter } from '@/modules/shared/utils/utils';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { useCallback, useEffect, useMemo } from 'react';
import { useFieldArray, useFormContext } from 'react-hook-form';
import { ProductionCalendarWorkCapacitiesQueries } from '../../settings/redux/productionCalendarsWorkCapacities/interfaces';
import { getProductionCalendarWorkCapacities } from '../../settings/redux/productionCalendarsWorkCapacities/thunks';
import { useHolidaysModal } from './useHolidaysModal';
import plus from '@/assets/plus.png';
import { clearState } from '../../settings/redux/productionCalendarsWorkCapacities/slice';
/**
 *
 * @param ns Localization Namespace
 * @returns List of holidays which are inside the time period selected by the user. Also returns the {@link useHolidaysModal | holidays modal } component.
 */
export const useHolidaysList = (ns: string, loading: boolean | undefined): JSX.Element => {
  const { holidays } = useAppSelector((state) => state.productionCalendarsWorkCapacities);
  const { translate } = useTranslate({ ns });
  const dispatch = useAppDispatch();

  const form = useFormContext();
  const { setValue } = form;

  useEffect(() => {
    setValue('holidays', holidays);
  }, [JSON.stringify(holidays), setValue]);

  useEffect(() => {
    return () => {
      dispatch(clearState());
    };
  }, [dispatch]);

  const { control } = useFormContext();
  const { fields } = useFieldArray({
    control,
    name: 'holidays',
  });

  const { watch } = form;

  const { workCenterIds, initialDate, finalDate } = watch();

  const handlePCFilterChange = useCallback((): void => {
    if (!workCenterIds || workCenterIds.length === 0) return;
    const queries: ProductionCalendarWorkCapacitiesQueries = {
      id: workCenterIds && workCenterIds[0],
      initialDate: initialDate,
      finalDate: finalDate,
    };
    dispatch(getProductionCalendarWorkCapacities(queries));
  }, [dispatch, finalDate, initialDate, workCenterIds]);

  const { holidaysModal, showHolidaysModal } = useHolidaysModal(handlePCFilterChange);

  useEffect(() => {
    handlePCFilterChange();
  }, [handlePCFilterChange]);

  const holidaysList = useMemo(
    () => (
      <div className='bottom-section'>
        <div className='top-part'>
          <div className='heading'>
            <h3>{translate('holidays')}</h3>
            <p>
              {holidays.length} {translate('results')}
            </p>
          </div>
          <CustomButton type='button' color='blue' onClick={showHolidaysModal} isDisabled={loading}>
            <div className='button-children'>
              <img src={plus} alt='' />
              <span>{translate('new_button')}</span>
            </div>
          </CustomButton>
        </div>
        {!!holidays.length && (
          <div className={`holidays-list ${holidays.length > 10 ? 'scroll-vertical' : ''}`}>
            {fields.map((field: any, index) => {
              return (
                <div className='holiday' key={field.id}>
                  <p className='holiday-date'>{dateFormatter(field.holidayDate!)}</p>
                  <CustomSwitch label={field.name} name={`holidays[${index}].isActive`} />
                </div>
              );
            })}
          </div>
        )}
        {holidaysModal}
      </div>
    ),
    [fields, holidays.length, holidaysModal, showHolidaysModal, translate],
  );

  return holidaysList;
};
