/**
 * @module TimePicker
 */

import React, { ReactElement, ReactNode, useState } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import dayjs, { Dayjs } from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { Button, Space, TimePicker } from 'antd';
import { PickerTimeProps } from 'antd/lib/date-picker/generatePicker';
import { useTranslate } from '../../../hooks/translate.hook';
import { timeFormat } from '../../../consts';
import './timepicker.scss';
import { DisabledTimes } from 'rc-picker/lib/interface';

dayjs.extend(customParseFormat);

export interface TimePickerProps extends Omit<PickerTimeProps<Dayjs>, 'picker'> {
  /** Used for registering input inside a form */
  name: string;
  /** Time format. Default is HH:MM */
  format?: string;
  /** Changes styling and makes input uninteractable */
  readOnly?: boolean;
  /** Disables interactions and changes styling */
  disabled?: boolean;

  selectedStartTime?: Dayjs | undefined;
}

const formatTime = (time: number): string => (time < 10 ? `0${time}` : `${time}`);

const CustomTimePicker: React.FC<TimePickerProps> = ({
  name,
  format = timeFormat,
  readOnly = false,
  selectedStartTime,
  ...props
}) => {
  const { translate } = useTranslate({
    ns: 'timePicker',
  });
  const { control } = useFormContext();

  const [open, setOpen] = useState(false);

  const getDisabledTimes = (current: Dayjs): DisabledTimes => {
    if (!selectedStartTime) {
      return {}; // No disabled times if start time is not selected
    }

    const selectedStartHour = selectedStartTime.hour();

    const disabledHours = Array.from({ length: selectedStartHour + 1 }, (_, index) => index);
   // const disabledMinutes = Array.from({ length: selectedStartMinute }, (_, index) => index);

    return {
      disabledHours: () => disabledHours,
    };
  };
  return (
    <Controller
      defaultValue={undefined}
      name={name}
      control={control}
      render={({ field }): ReactElement => (
        <Space direction='vertical'>
          <TimePicker
            {...props}
            {...field}
            allowClear={false}
            inputReadOnly={readOnly}
            defaultValue={undefined}
            popupClassName='timepicker'
            showNow={false}
            disabled={readOnly}
            disabledTime={getDisabledTimes}
            open={open}
            onOpenChange={(openDropdown: boolean): void => setOpen(openDropdown)}
            value={field.value ? dayjs(field.value, format) : undefined}
            format={format}
            onSelect={(value): void => {
              field.onChange(
                `${formatTime(dayjs(value).get('hour'))}:${formatTime(dayjs(value).get('minute'))}`,
              );
            }}
            onChange={(value): void => {
              field.onChange(
                value == null
                  ? undefined
                  : `${formatTime(dayjs(value).get('hour'))}:${formatTime(
                      dayjs(value).get('minute'),
                    )}`,
              );
            }}
            renderExtraFooter={(): ReactNode => (
              <Button
                size='small'
                type='primary'
                className='confirm-time'
                onClick={(): void => setOpen(false)}
              >
                {translate('ok')}
              </Button>
            )}
          />
        </Space>
      )}
    />
  );
};

export default CustomTimePicker;
