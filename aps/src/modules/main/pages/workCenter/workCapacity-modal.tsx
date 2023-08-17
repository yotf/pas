/**
 * @module WorkCapacityModal
 */

import percent from '@/assets/icons/percent.svg';
import { zeroHourPlaceholder } from '@/modules/shared/consts';
import { DayOfWeek } from '@/modules/shared/utils/dayOfWeek.enum';
import { Modal } from 'antd';
import { FC, useEffect, useMemo, useState } from 'react';
import { FormProvider } from 'react-hook-form';
import CustomInput from '../../../shared/components/input/input.component';
import { useTranslate } from '../../../shared/hooks/translate.hook';
import { calculateMinutes, limitNumberOfChars, nameofFactory } from '../../../shared/utils/utils';
import { WorkCapacityMapped } from '../settings/redux/workcenterCapacities/interfaces';
import { useWorkCapacityForm } from './hooks/useWorkCapacityForm';
import dayjs from 'dayjs';

export type Props = {
  workCapacity?: WorkCapacityMapped;
  onClose: () => void;
};
/**
 *
 * @param workCapacity Comes from {@link WorkCenterMaintainTable} component. User selects a work capacity to edit and the values of the selected capacity are
 * entered inside the form by using {@link useWorkCapacityFormAutofill}.
 * @param onClose Clears selected work capacity which closes the modal
 * @returns Modal with form values filled
 */
const WorkCapacityModal: FC<Props> = ({ workCapacity, onClose }) => {
  const { translate } = useTranslate({ ns: 'workCenters', keyPrefix: 'maintain' });
  const { form, onSubmit } = useWorkCapacityForm({ workCapacity, onClose });
  const [selectedStartTime, setSelectedStartTime] = useState<string | undefined>(undefined);
  const nameof = nameofFactory<WorkCapacityMapped>();

  const { trigger, setValue, watch, resetField } = form;

  const { start, end, break: breakTime, efficiency, capacity, minutes } = watch();

  useEffect(() => {
    const { minutes, availableMinutes } = calculateMinutes(breakTime, start, end, efficiency);
    setValue(nameof('minutes'), minutes);
    setValue(nameof('availableMinutes'), availableMinutes);
  }, [start, end, breakTime, efficiency]);

  useEffect(() => {
    setValue('break', breakTime);
    setValue('efficiency', efficiency);
    setValue('capacity', capacity);
  }, [breakTime, capacity, efficiency, end, setValue, start]);

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

  const {
    formState: { isValid, isDirty },
  } = form;
  return (
    <FormProvider {...form}>
      <Modal
        okButtonProps={{ disabled: !isDirty || !isValid }}
        className='routes-modal'
        centered
        open={!!workCapacity}
        title={translate(String(DayOfWeek[workCapacity?.dayOfWeek ?? 0]))}
        okText={translate('save')}
        onOk={onSubmit}
        cancelText={translate('cancel')}
        onCancel={onClose}
      >
        <CustomInput
          type='time'
          label={translate('start')}
          placeholder={zeroHourPlaceholder}
          name={nameof('start')}
          isRequired={true}
        />
        <CustomInput
          type='time'
          label={translate('end')}
          placeholder={zeroHourPlaceholder}
          name={nameof('end')}
          isRequired={true}
          selectedStartTime={selectedStartTime ? dayjs(selectedStartTime, 'HH:mm') : undefined}
        />
        <CustomInput
          type='number'
          label={translate('break')}
          placeholder={translate('break')}
          name={nameof('break')}
          isRequired={true}
          onKeyDownEvent={(e) => limitNumberOfChars(e, 4)}
        />
        <CustomInput
          type='number'
          label={translate('efficiency')}
          placeholder={translate('efficiency')}
          name={nameof('efficiency')}
          isRequired={true}
          icon={percent}
          iconRight
          onKeyDownEvent={(e) => limitNumberOfChars(e, 3)}
        />
        <CustomInput
          type='number'
          label={translate('capacity')}
          placeholder={translate('capacity')}
          name={nameof('capacity')}
          onKeyDownEvent={(e) => limitNumberOfChars(e, 4)}
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
      </Modal>
    </FormProvider>
  );
};

export default WorkCapacityModal;
