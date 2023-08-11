/**
 * @module TimePicker
 */

import React, { ReactElement, ReactNode, useEffect, useState } from 'react';
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
  const { control, getValues } = useFormContext();

  const fieldValue = getValues(name);

  const [open, setOpen] = useState(false);
  const [timeValue, setTimeValue] = useState<Dayjs | null>();
  useEffect(() => {
    dayjs(fieldValue, 'HH:mm', true).isValid() ? setTimeValue(fieldValue) : setTimeValue(undefined);
  }, [fieldValue]);

  const getDisabledTimes = (current: Dayjs): DisabledTimes => {
    if (!selectedStartTime) {
      return {}; // No disabled times if start time is not selected
    }

    const selectedStartHour = selectedStartTime.hour();
    const selectedStartMinute = selectedStartTime.minute();

    const disabledHours = Array.from({ length: selectedStartHour }, (_, index) => index);
    const disabledMinutes = Array.from({ length: selectedStartMinute }, (_, index) => index);

    return {
      disabledHours: () => disabledHours,
      disabledMinutes: (hour: number) => {
        if (hour === disabledHours[disabledHours.length - 1] + 1) {
          return disabledMinutes;
        }
        return [];
      },
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
            onOpenChange={(openDropdown: boolean): void => {
              debugger;
              if (!openDropdown && timeValue) {
                field.onChange(
                  !timeValue
                    ? undefined
                    : `${formatTime(dayjs(timeValue).get('hour'))}:${formatTime(
                        dayjs(timeValue).get('minute'),
                      )}`,
                );
              }
              setOpen(openDropdown);
            }}
            value={timeValue && dayjs(timeValue, format)}
            format={format}
            onSelect={(value): void => {
              setTimeValue(value);
              // field.onChange(
              //   `${formatTime(dayjs(value).get('hour'))}:${formatTime(dayjs(value).get('minute'))}`,
              // );
            }}
            onChange={(value): void => {
              setTimeValue(value);
              // field.onChange(
              //   !value
              //     ? undefined
              //     : `${formatTime(dayjs(value).get('hour'))}:${formatTime(
              //         dayjs(value).get('minute'),
              //       )}`,
              // );
            }}
            renderExtraFooter={(): ReactNode => (
              <Button
                size='small'
                type='primary'
                className='confirm-time'
                onClick={(): void => {
                  debugger;
                  field.onChange(
                    !timeValue
                      ? undefined
                      : `${formatTime(dayjs(timeValue).get('hour'))}:${formatTime(
                          dayjs(timeValue).get('minute'),
                        )}`,
                  );
                  setOpen(false);
                }}
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
