/**
 * @module DatePicker
 */

import { DatePicker, Space } from 'antd';
import { RangePickerProps } from 'antd/lib/date-picker';
import dayjs, { Dayjs } from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import React, { HTMLAttributes, ReactElement } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { euDateFormat } from '../../../consts/index';

dayjs.extend(customParseFormat);

export type DatePickerProps = HTMLAttributes<HTMLInputElement> & {
  name: string;
  format?: string;
  readOnly?: boolean;
  noPastDates?: boolean;
  disableDatesFrom?: Dayjs;
  disableDatesAfter?: Dayjs;
  disabled?: boolean;
  value?: string;
  onSelectionChange?: (value: Dayjs | null) => void;
};
/**
 *
 * @param name Name used for registering input in a form
 * @param format Date format used by input, default is dd/mm/yyyy
 * @param noPastDates Disables dates in the past
 * @param disableDatesFrom Disables dates before this value
 * @param disableDatesAfter Disables dates after this value
 * @param disabled Is datepicker disabled
 * @returns A datepicker component customized by props passed down from {@link Input}
 */
const CustomDatePicker: React.FC<DatePickerProps> = ({
  name,
  format = euDateFormat,
  readOnly = false,
  noPastDates,
  disableDatesFrom,
  disableDatesAfter,
  disabled,
  onSelectionChange,
  value,
  ...props
}) => {
  const { control } = useFormContext();

  const disabledFrom: RangePickerProps['disabledDate'] = (current) => {
    return current < dayjs(disableDatesFrom);
  };

  const disabledAfter: RangePickerProps['disabledDate'] = (current) => {
    return (
      (!!disableDatesAfter && current > dayjs(disableDatesAfter)) ||
      (!!noPastDates && current < dayjs().startOf('day'))
    );
  };

  const disableDates: RangePickerProps['disabledDate'] = (current) => {
    const disabled =
      (!!disableDatesFrom ? disabledFrom(current) : false) ||
      (!!disableDatesAfter || !!noPastDates ? disabledAfter(current) : false);
    return disabled;
  };

  return (
    <Controller
      defaultValue={''}
      name={name}
      control={control}
      render={({ field }): ReactElement => {
        const newValue = value ? dayjs(value) : field.value ? dayjs(field.value) : undefined;
        return (
          <Space direction='vertical'>
            <DatePicker
              {...props}
              {...field}
              inputReadOnly={readOnly}
              defaultValue={undefined}
              value={newValue}
              format={format}
              picker='date'
              disabled={disabled}
              disabledDate={disableDates}
              onSelect={
                onSelectionChange
                  ? onSelectionChange
                  : (value): void => {
                      return field.onChange(value?.toISOString() ?? '');
                    }
              }
              onChange={(value): void => {
                if (onSelectionChange) return;
                return field.onChange(value?.toISOString() ?? '');
              }}
            />
          </Space>
        );
      }}
    />
  );
};

export default CustomDatePicker;
