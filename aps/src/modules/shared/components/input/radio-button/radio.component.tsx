/**@module CustomRadio */
import { Radio, RadioChangeEvent } from 'antd';
import { DefaultOptionType } from 'antd/lib/select';
import React, { HTMLAttributes, ReactElement } from 'react';
import { Controller, useFormContext } from 'react-hook-form';

export type RadioProps = HTMLAttributes<HTMLInputElement> & {
  /** Used for registering input inside a form */
  name: string;
  /** Type of input*/
  type: string;
  /** Each option creates one radio button */
  options?: DefaultOptionType[];
  /** Event to be triggered before changing radio values (used for opening {@link useRadioChangeModal}). Can be used for other events too*/
  customChangeEvent?: (callback: () => void) => void;
};
/**
 * @returns A radio group with radio buttons created from options param
 */
export const CustomRadio: React.FC<RadioProps> = ({
  name,
  options,
  type,
  customChangeEvent,
  ...props
}) => {
  const { control } = useFormContext();
  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { onChange, ...field } }): ReactElement<any, any> => (
        <Radio.Group
          {...field}
          {...props}
          value={field.value || 1}
          onChange={(e: RadioChangeEvent): void => {
            const changeCallback = (): void => {
              onChange(Number(e.target.value));
            };
            if (customChangeEvent) customChangeEvent(changeCallback);
            else onChange(Number(e.target.value));
          }}
          onBlur={(e): void => {
            e.preventDefault();
          }}
        >
          {options?.map((option) => {
            return (
              <Radio key={option.value} type={type} value={option.value}>
                {option.label}
              </Radio>
            );
          })}
        </Radio.Group>
      )}
    />
  );
};

export default CustomRadio;
