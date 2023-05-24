/**
 * @module SelectInput
 */

import { SelectInputType } from '@/modules/shared/consts';
import { Select } from 'antd';
import { DefaultOptionType } from 'antd/lib/select';
import React, { HTMLAttributes } from 'react';
import { useController, useFormContext } from 'react-hook-form';
import './select.scss';

export type SelectProps = HTMLAttributes<HTMLInputElement> & {
  /** Used for registering input inside a form */
  name: string;
  /** Used for rendering dropdown options */
  options?: DefaultOptionType[];
  /** Is select disabled */
  disabled?: boolean;
  /** Is select a mandatory field */
  isRequired?: boolean;
  /** Makes options searchable via user text */
  isAutocomplete?: boolean;
  /** Defines if multiple options are selectable or not*/
  mode?: SelectInputType;
  /** Renders a clear button inside the input */
  allowClear?: boolean;
};
/** A customizable select input with options provided */
const CustomSelect: React.FC<SelectProps> = ({
  name,
  isRequired,
  isAutocomplete = false,
  mode,
  allowClear,
  ...props
}) => {
  const { control, getValues } = useFormContext();
  const { field } = useController({ name, control });
  return (
    <Select
      getPopupContainer={(triggerNode): HTMLElement => triggerNode.parentElement}
      {...props}
      {...field}
      value={getValues(name)}
      allowClear={allowClear ?? !isRequired}
      mode={mode}
      listHeight={133}
      showSearch={isAutocomplete}
      {...(isAutocomplete && {
        filterOption: (input: string, option: DefaultOptionType | undefined): boolean =>
          (option?.label ?? '').toString().toLowerCase().includes(input.toLowerCase()) ?? false,
      })}
    />
  );
};

export default CustomSelect;
