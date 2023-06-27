/**
 * @module InputInterfaces
 */

import { DefaultOptionType } from 'antd/lib/select';
import { Dayjs } from 'dayjs';
import { HTMLInputTypeAttribute } from 'react';
import { FieldError, UseFormRegisterReturn } from 'react-hook-form';
import { SelectInputType } from '../../consts';
/**
 * Type of input
 */
export type InputType = HTMLInputTypeAttribute | 'select' | 'textarea' | 'readonly';

/**
 * Interface used for defining an Input
 */
export interface Input {
  /** Input Label text */
  label?: string;
  /** Input Placeholder text */
  placeholder?: string;
  /** Method extracted from React Hook Form, entered value is used for saving, updating and validating user inputed values*/
  register?: UseFormRegisterReturn<string>;
  /** Can be used instead of Register for same purpose */
  name?: string;
  /** Defines what type of input will be rendered */
  type: InputType;
  /** Targets validation errors created by React Hook Form */
  error?: FieldError;
  /** Options used by Input if its type is Radio or Select */
  options?: DefaultOptionType[];
  /**Input Icon, by default rendered on the left side */
  icon?: string;
  /**Is the field mandatory */
  isRequired?: boolean;
  /**Is input disabled */
  disabled?: boolean;
  /** Custom change event which triggers before the on change event */
  customChangeEvent?: (callback: () => void) => void;
  /**Regular inputs have a max width of 310px, full-width 100% */
  width?: 'regular' | 'full-width';
  /**Render input with readonly styles */
  readOnly?: boolean;
  /**Input Value */
  value?: any;
  /** Renders icon on the right side of input */
  iconRight?: boolean;
  /** No dates before today for date inputs */
  noPastDates?: boolean;
  /** Includes autocomplete search for dropdowns */
  isAutocomplete?: boolean;
  /** If input is type Select defines if multiple options are selectable */
  mode?: SelectInputType;
  /** Disables dates before this value */
  disableDatesFrom?: Dayjs;
  /** Disables date after this value */
  disableDatesAfter?: Dayjs;
  /** Renders the clear input button*/
  allowClear?: boolean;
  /**Input height in px */
  height?: string;
  /**Number of columns, used for textarea type input */
  cols?: number;
  /**Number of rows, used for textarea type input */
  rows?: number;
  /**Should input witdh adjust to lenght of entered value */
  autoWidth?: boolean;
  /**Input maximum length */
  maxLength?: number;
  /**Used for checking user value before letting it get to form */
  onKeyDownEvent?: (event: React.KeyboardEvent<HTMLInputElement>) => void;
  /** Passed for select element to handle selection change */
  handleSelectionChange?: (value: any, option: any) => void;
}

export interface SwitchInput {
  /**Switch input label */
  label: string;
  /**Used for registering to React Hook Form */
  name: string;
}
