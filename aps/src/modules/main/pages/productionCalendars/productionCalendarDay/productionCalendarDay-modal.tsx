/**
 * @module ProductionCalendarDayModal
 */

import percent from '@/assets/icons/percent.svg';
import CustomInput from '@/modules/shared/components/input/input.component';
import { zeroHourPlaceholder } from '@/modules/shared/consts';
import { useTranslate } from '@/modules/shared/hooks/translate.hook';
import {
  calculateMinutes,
  limitToNumericKeyDown,
  nameofFactory,
} from '@/modules/shared/utils/utils';
import { Modal } from 'antd';
import dayjs from 'dayjs';
import { FC, useEffect, useMemo, useRef, useState } from 'react';
import { FormProvider } from 'react-hook-form';
import { ProductionCalendarDayMapped } from '../../settings/redux/productionCalendarsWorkCapacities/interfaces';
import { usePCDayForm } from './usePCDayForm';
import { useProductionCalendarDayAutofill } from './useProductionCalendarDayAutofill';

export type Props = {
  productionCalendarDay?: ProductionCalendarDayMapped;
  onClose: () => void;
};
/**
 *
 * @param productionCalendarDay Comes from {@link ProductionCalendarChecking} page. User selects a day to edit and the values of the selected capacity are
 * entered inside the form by using {@link useProductionCalendarDayAutofill}.
 * @param onClose Clears selected production calendar day which closes the modal
 * @returns Modal with form values filled
 */
const ProductionCalendarDayModal: FC<Props> = ({ productionCalendarDay, onClose }) => {
  const { translate } = useTranslate({ ns: 'workCenters', keyPrefix: 'maintain' });
  const { form, onSubmit } = usePCDayForm({ productionCalendarDay, onClose });
  const [selectedStartTime, setSelectedStartTime] = useState<string | undefined>(undefined);
  const isFirstReset = useRef(true);
  const nameof = nameofFactory<ProductionCalendarDayMapped>();
  const { watch, setValue, resetField, trigger } = form;

  const { start, end, break: breakTime, efficiency, minutes, availableMinutes } = watch();

  useProductionCalendarDayAutofill(form, productionCalendarDay!);

  useEffect(() => {
    const { minutes, availableMinutes: availableMinutesCalculated } = calculateMinutes(
      breakTime,
      start,
      end,
      efficiency,
    );

    if (minutes === productionCalendarDay?.minutes) return;

    setValue(nameof('minutes'), minutes);
    setValue(nameof('availableMinutes'), availableMinutesCalculated);
  }, [start, end, breakTime, efficiency, availableMinutes]);

  const readOnlyFields = useMemo(() => {
    if (!productionCalendarDay?.date) return false;
    return (
      dayjs(productionCalendarDay?.date).isBefore(dayjs(), 'day') ||
      dayjs(productionCalendarDay?.date).isSame(dayjs(), 'day')
    );
  }, [productionCalendarDay?.date]);

  const {
    formState: { isValid, isDirty },
  } = form;

  useEffect(() => {
    const t = start === zeroHourPlaceholder || start === '' ? undefined : start;
    setSelectedStartTime(t);
  }, [start]);

  useEffect(() => {
    if (dayjs(start, 'HH:mm').isAfter(dayjs(end, 'HH:mm'))) {
      resetField('end', { defaultValue: '' });
    }
  }, [start, end]);

  useEffect(() => {
    trigger('break');
  }, [minutes]);

  return (
    <FormProvider {...form}>
      <Modal
        okButtonProps={!readOnlyFields ? { disabled: !isValid || !isDirty } : { disabled: true }}
        className='routes-modal'
        centered
        open={!!productionCalendarDay}
        title={translate('title')}
        okText={translate('save')}
        onOk={onSubmit}
        cancelText={translate('cancel')}
        onCancel={onClose}
        transitionName=''
      >
        <CustomInput
          type='time'
          label={translate('start')}
          placeholder={zeroHourPlaceholder}
          name={nameof('start')}
          isRequired={true}
          readOnly={readOnlyFields}
        />
        <CustomInput
          type='time'
          label={translate('end')}
          placeholder={zeroHourPlaceholder}
          name={nameof('end')}
          isRequired={true}
          readOnly={readOnlyFields}
          selectedStartTime={selectedStartTime ? dayjs(selectedStartTime, 'HH:mm') : undefined}
        />
        <CustomInput
          type='tel'
          pattern='[0-9]*'
          label={translate('break')}
          placeholder={translate('break')}
          name={nameof('break')}
          isRequired={true}
          readOnly={readOnlyFields}
          maxLength={4}
          onKeyDownEvent={limitToNumericKeyDown}
        />
        <CustomInput
          type='tel'
          pattern='[0-9]*'
          onKeyDownEvent={limitToNumericKeyDown}
          label={translate('efficiency')}
          placeholder={translate('efficiency')}
          name={nameof('efficiency')}
          isRequired={true}
          icon={percent}
          iconRight
          readOnly={readOnlyFields}
          maxLength={3}
        />
        <CustomInput
          type='tel'
          pattern='[0-9]*'
          label={translate('capacity')}
          placeholder={translate('capacity')}
          name={nameof('capacity')}
          readOnly={readOnlyFields}
          maxLength={4}
          onKeyDownEvent={limitToNumericKeyDown}
        />
        <br />
        <CustomInput
          type='number'
          label={translate('minutes')}
          placeholder={translate('minutes')}
          name={nameof('minutes')}
          readOnly
        />
        <CustomInput
          type='number'
          label={translate('availableMinutes')}
          placeholder={translate('availableMinutes')}
          name={nameof('availableMinutes')}
          readOnly
        />
        <div className='span-full'>
          <CustomInput
            type='textarea'
            label={translate('remark')}
            placeholder={translate('remark')}
            name={nameof('remark')}
            width='full-width'
            readOnly={readOnlyFields}
            disabled={readOnlyFields}
          />
        </div>
      </Modal>
    </FormProvider>
  );
};

export default ProductionCalendarDayModal;
