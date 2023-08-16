/**@module Utils */
import { getRole } from '@/modules/auth/services/auth.service';
import { IdentifiableEntity } from '@/modules/main/pages/settings/redux/thunks';
import { DefaultOptionType } from 'antd/es/select';
import dayjs from 'dayjs';
import { UseFormReturn } from 'react-hook-form';
import CustomInput from '../components/input/input.component';
import { euDateFormat, timeFormat } from '../consts';
import { ROLE_ADMINISTRATOR } from '../consts/roles';
/** Check if user is admin */
export const isUserNotAdmin = (): boolean => {
  return getRole() !== ROLE_ADMINISTRATOR;
};
/** Formats default javascript date format to DD.MM.YYYY */
export const dateFormatter = (date: string | undefined): string => {
  if (!date) return '';
  return dayjs(date).format(euDateFormat);
};

export const limitNumberOfChars = (
  event: React.KeyboardEvent<HTMLInputElement> | React.KeyboardEvent<HTMLTextAreaElement>,
  maxLength: number,
): void => {
  const value = event.currentTarget.value;
  if (value.length >= maxLength && event.key != 'Backspace' && !isTextSelected(event))
    event.preventDefault();
};

export const limitToNumericKeyDown = (
  e: React.KeyboardEvent<HTMLInputElement> | React.KeyboardEvent<HTMLTextAreaElement>,
) => {
  const key = e.key;

  // Allow control keys
  if (e.ctrlKey || e.altKey || e.metaKey || key === 'Backspace') {
    return;
  }

  // Allow digits
  if (!/^\d+$/.test(key)) {
    e.preventDefault();
  }
};

export const isTextSelected = (
  event: React.KeyboardEvent<HTMLInputElement> | React.KeyboardEvent<HTMLTextAreaElement>,
) => {
  const selectionStart = (event.target as HTMLInputElement).selectionStart;
  const selectionEnd = (event.target as HTMLInputElement).selectionEnd;
  if ((!selectionStart && selectionStart !== 0) || (!selectionEnd && selectionEnd !== 0))
    return false;

  return selectionEnd > selectionStart;
};

export const handleTimeFormatKeyDown = (
  event: React.KeyboardEvent<HTMLInputElement> | React.KeyboardEvent<HTMLTextAreaElement>,
) => {
  const inputValue = (event.target as HTMLInputElement).value;
  const key = event.key;
  if (isTextSelected(event)) return;

  const cursorPosition = (event.target as HTMLInputElement).selectionStart;

  // Allow control keys
  if (event.ctrlKey || event.altKey || event.metaKey || key === 'Backspace') {
    return;
  }

  // Validate the key press
  if (!/^\d$/.test(key) && key !== '.' && key !== 'Tab') {
    event.preventDefault();
  }

  // Prevent entering more than one decimal point
  if (key === '.' && inputValue.includes('.')) {
    event.preventDefault();
  }

  const s = inputValue.split('.')[0];

  // Limit to 4 leading and 4 trailing digits
  if (inputValue.includes('.') && inputValue.split('.')[1]?.length >= 3) {
    event.preventDefault();
  }

  if (
    key !== '.' &&
    inputValue.split('.')[0].length >= 4 &&
    (cursorPosition || cursorPosition === 0) &&
    cursorPosition <= 4
  ) {
    event.preventDefault();
  }
};

export const isValidDateFormat = (dateString: string) => {
  const formats = [
    'YYYY-MM-DD',
    'YYYY-MM-DDTHH:mm:ss.SSSSSSS', // Added the format for '2023-07-19T13:16:36.8241272'
  ];

  for (const format of formats) {
    if (dayjs(dateString, format).isValid()) {
      return true;
    }
  }

  return false;
};

export const isEuropeanDateFormat = (dateString: string | undefined): boolean => {
  const regex = /^\d{2}\.\d{2}\.\d{4}$/;
  if (!dateString) return false;
  return regex.test(dateString);
};
/**  Error returned if a lstrings length passes the one needed in schema the validation schema*/
export const translateMaxLengthMessage = (
  maxLength: number,
  translate: (value: string, options?: Record<string, string>) => string,
): string => {
  return translate('max_length', { name: maxLength.toString() });
};
/** Replaces all spaces in an input. Used if input cannot have spaces (e.g. passwords)*/
export const trimInput = (value: string): string => {
  return value.replaceAll(/\s\s+/g, ' ').trimStart();
};
/** Removes extra spaces from schema values*/
export const removeExtraSpaces = (value: string): string => value.replace(/ +(?= )/g, '').trim();

/** Factory used for typing assistance */
export const nameofFactory =
  <T extends object>() =>
  (name: keyof T): keyof T =>
    name;
/** Creates options for selects and dropdowns from an array of values */
export const mapDataToOptions = (data?: IdentifiableEntity[]): DefaultOptionType[] =>
  data
    ?.filter((entity) => entity.isActive)
    .map((entity) => ({ label: entity.name, value: entity.id })) ?? [];
/** Calculates minutes for modals ({@link WorkCapacityModal } and {@link ProductionCalendarDayModal})*/
export const calculateMinutes = (
  breakTimeParam: number | undefined,
  startTime: string | undefined,
  endTime: string | undefined,
  efficiencyValue: number | undefined,
): { minutes: number | undefined; availableMinutes: number | undefined } => {
  const minutes =
    (breakTimeParam != undefined &&
      dayjs(endTime, timeFormat).diff(dayjs(startTime, timeFormat), 'minute') - breakTimeParam) ||
    0;
  const availableMinutes =
    (efficiencyValue != undefined && minutes && Math.round(minutes * (efficiencyValue / 100))) || 0;

  return { minutes, availableMinutes };
};

export type FilterInput = 'radio' | 'select';
export type FilterRegister = 'search' | 'status' | 'situation';
export type FormCustomFilter = {
  search: string;
  status: string | number | undefined;
  situation: string | number | undefined;
};

export type AdditionalFilterInfo = {
  options: DefaultOptionType[];
  type: FilterInput;
  register: FilterRegister;
  allowClear?: boolean;
};
export interface PageTableAdditionalElements {
  filters: AdditionalFilterInfo[];
  buttons: JSX.Element;
}
/** Creates an additional filter input from additional elements. Used in {@link SettingsTable} */
export const createCustomFilter = (
  form: UseFormReturn<FormCustomFilter, any>,
  filter: AdditionalFilterInfo,
): JSX.Element => {
  const { register } = form;
  const { type, options, register: registerParam, allowClear } = filter;
  return (
    <CustomInput
      type={type}
      register={register(registerParam)}
      options={options}
      width='full-width'
      allowClear={allowClear}
    />
  );
};
/**
 *
 * @returns CSS class based on values of the table cell
 */
export const availabilityStyling = (value: number): string => {
  switch (true) {
    case value <= -200:
      return 'yellow-color';
    case value > -200 && value <= -100:
      return 'yellow-light';
    case value >= -100 && value <= 0:
      return 'yellow-lighter';
    case value > 0 && value <= 100:
      return 'green-light';
    case value > 100 && value <= 200:
      return 'green-color';
    case value > 200:
      return 'green-dark';
    default:
      return '';
  }
};
/**
 *
 * @param event Input event
 * Prevents dots from being inputed in number type inputs
 */
export const onKeydownEvent = (
  event: React.KeyboardEvent<HTMLInputElement> | React.KeyboardEvent<HTMLTextAreaElement>,
): void => {
  if (event.key.includes('.')) event.preventDefault();
};
