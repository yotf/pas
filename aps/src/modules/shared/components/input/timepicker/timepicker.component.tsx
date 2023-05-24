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
}

const formatTime = (time: number): string => (time < 10 ? `0${time}` : `${time}`);

const CustomTimePicker: React.FC<TimePickerProps> = ({
  name,
  format = timeFormat,
  readOnly = false,
  ...props
}) => {
  const { translate } = useTranslate({
    ns: 'timePicker',
  });
  const { control } = useFormContext();

  const [open, setOpen] = useState(false);
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
