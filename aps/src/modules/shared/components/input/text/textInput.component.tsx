/**
 * @module TextInput
 */

import { Input } from 'antd';
import React, { ReactElement, useCallback, useState } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { trimInput } from '../../../utils/utils';

export type TextInputProps = {
  /** Used for registering input inside a form */
  name: string;
  /** Type of input */
  type: string;
  /** Icon used inside the input */
  icon: string;
  /** Changes input styling, removes borders and background*/
  readOnly?: boolean;
  /** Is input disabled */
  disabled?: boolean;
  /** Event used to prevent entering certain keys by the user (eg '.' in number inputs) */
  onKeyDownEvent?: (event: React.KeyboardEvent<HTMLInputElement>) => void;
  /** If true input will adjust its width to width of value entered  */
  autoWidth?: boolean;
  /** Max number of characters the input accepts */
  maxLength?: number;

  onBlur?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onTextChange?: (value: number | string) => void;

  pattern?: string;
};
/**
 *
 * @returns A customizable text input
 */
const CustomTextInput: React.FC<TextInputProps> = ({
  name,
  type,
  disabled,
  icon,
  onKeyDownEvent,
  autoWidth,
  maxLength,
  onBlur,
  onTextChange,
  pattern,
  ...props
}) => {
  const { control } = useFormContext();
  const trimInputPassword = useCallback((value: string): string => {
    return value.replaceAll(/\s\s+/g, ' ').trim();
  }, []);
  const [calculatedWidth, setCalculatedWidth] = useState<number | undefined>(40);

  const calcWidth = useCallback(
    (val: number) => {
      return autoWidth ? setCalculatedWidth(val > 2 ? val * 11 : 25) : undefined;
    },
    [autoWidth],
  );

  return (
    <Controller
      name={name}
      control={control}
      defaultValue=''
      render={({ field: { onChange, ...field } }): ReactElement<any, any> => (
        <Input
          {...field}
          autoComplete='off'
          maxLength={maxLength}
          type={type}
          pattern={pattern}
          {...props}
          disabled={disabled}
          {...(icon && { style: { backgroundImage: `url(${icon})` } })}
          {...(autoWidth && { style: { width: calculatedWidth } })}
          onChange={({ target: { value } }): void => {
            if (onTextChange) onTextChange(value);
            calcWidth(value.length);
            onChange(name === 'password' ? trimInputPassword(value) : trimInput(value));
          }}
          onBlur={(event): void => {
            field.onBlur();
            onBlur ? onBlur(event) : null;
            calcWidth(event.target.value.length);
          }}
          className={disabled ? 'ant-input-disabled' : ''}
          {...(onKeyDownEvent && {
            onKeyDown: onKeyDownEvent,
          })}
        />
      )}
    />
  );
};

export default CustomTextInput;
