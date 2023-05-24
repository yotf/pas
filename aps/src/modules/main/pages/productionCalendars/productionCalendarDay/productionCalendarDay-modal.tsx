/**
 * @module ProductionCalendarDayModal
 */

import percent from '@/assets/icons/percent.svg';
import CustomInput from '@/modules/shared/components/input/input.component';
import { zeroHourPlaceholder } from '@/modules/shared/consts';
import { useTranslate } from '@/modules/shared/hooks/translate.hook';
import { calculateMinutes, nameofFactory } from '@/modules/shared/utils/utils';
import { Modal } from 'antd';
import dayjs from 'dayjs';
import { FC, useEffect, useMemo } from 'react';
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
  const nameof = nameofFactory<ProductionCalendarDayMapped>();
  const { watch, setValue } = form;

  const { start, end, break: breakTime, efficiency } = watch();

  useProductionCalendarDayAutofill(form, productionCalendarDay!);

  useEffect(() => {
    const { minutes, availableMinutes } = calculateMinutes(breakTime, start, end, efficiency);
    setValue(nameof('minutes'), minutes);
    setValue(nameof('availableMinutes'), availableMinutes);
  }, [start, end, breakTime, efficiency]);

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
        />
        <CustomInput
          type='number'
          label={translate('break')}
          placeholder={translate('break')}
          name={nameof('break')}
          isRequired={true}
          readOnly={readOnlyFields}
        />
        <CustomInput
          type='number'
          label={translate('efficiency')}
          placeholder={translate('efficiency')}
          name={nameof('efficiency')}
          isRequired={true}
          icon={percent}
          iconRight
          readOnly={readOnlyFields}
        />
        <CustomInput
          type='number'
          label={translate('capacity')}
          placeholder={translate('capacity')}
          name={nameof('capacity')}
          readOnly={readOnlyFields}
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
