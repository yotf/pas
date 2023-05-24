/**
 * @module usePCDayForm
 */

import { useTranslate } from '@/modules/shared/hooks/translate.hook';
import { notificationSuccess } from '@/modules/shared/services/notification.service';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { yupResolver } from '@hookform/resolvers/yup';
import { useMemo } from 'react';
import { useForm, UseFormReturn } from 'react-hook-form';
import { upsertProductionCalendar } from '../../settings/redux/productionCalendars/thunks';
import { ProductionCalendarDayMapped } from '../../settings/redux/productionCalendarsWorkCapacities/interfaces';
import { usePCDaySchema } from './usePCDaySchema';

export type Props = {
  productionCalendarDay?: ProductionCalendarDayMapped;
  onClose: () => void;
};

export type Return = {
  form: UseFormReturn<ProductionCalendarDayMapped>;
  onSubmit: () => void;
};
/**
 *
 * @param productionCalendarDay Production calendar day selected by user when clicking triggering the on edit function in the {@link ProductionCalendarChecking} page.
 * @param onClose Clears selected Production calendar day and closes the modal
 * @returns Production Calendar day form used in {@link ProductionCalendarDayModal}.
 */
export const usePCDayForm = ({ productionCalendarDay, onClose }: Props): Return => {
  const validationSchema = usePCDaySchema(productionCalendarDay!);
  const form = useForm<ProductionCalendarDayMapped>({
    resolver: yupResolver(validationSchema),
    mode: 'onBlur',
  });
  const { error } = useAppSelector((state) => state.productionCalendars);

  const dispatch = useAppDispatch();

  const { handleSubmit } = form;

  const { translate } = useTranslate({ ns: 'productionCalendar', keyPrefix: 'validation' });

  const onSubmit = useMemo(
    () =>
      handleSubmit(async (data: ProductionCalendarDayMapped) => {
        const dataMapped = { ...data, weekDay: data.date };
        dispatch(upsertProductionCalendar(dataMapped));

        onClose();
        if (!error) notificationSuccess(translate('edit_success'));
      }),
    [dispatch, error, handleSubmit, onClose, translate],
  );

  return { form, onSubmit };
};
