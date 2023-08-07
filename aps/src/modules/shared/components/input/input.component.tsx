/**
 * @module Input
 */

import React, { useMemo } from 'react';
import { FieldError, useFormContext } from 'react-hook-form';
import CustomDatePicker from './datepicker/datepicker.component';
import './input.scss';
import { Input } from './interfaces';
import CustomRadio from './radio-button/radio.component';
import CustomSelect from './select/select.component';
import CustomTextInput from './text/textInput.component';
import CustomTextArea from './textArea/textarea.component';
import CustomTimePicker from './timepicker/timepicker.component';
import Validation from './validation.component';
/**@return An customizable input of chosen type*/
const CustomInput: React.FC<Input> = ({
  label,
  placeholder,
  register,
  name,
  type,
  error,
  icon,
  options,
  isRequired,
  disabled,
  customChangeEvent,
  width = 'regular',
  value,
  iconRight,
  readOnly,
  noPastDates = false,
  isAutocomplete = false,
  mode,
  disableDatesFrom,
  disableDatesAfter,
  allowClear,
  height = undefined,
  cols = undefined,
  rows = undefined,
  onKeyDownEvent = undefined,
  autoWidth = false,
  maxLength,
  handleSelectionChange,
  dropDownStyle,
  onBlur,
  onTextChange,
  listHeight,
  selectedStartTime,
}) => {
  const {
    watch,
    formState: { errors },
  } = useFormContext();

  placeholder = placeholder === '' ? placeholder : placeholder || label;
  const fieldName = name || register?.name || '';
  error = error || (errors[fieldName] as FieldError);
  value = value === undefined ? watch()[fieldName] : value;

  const isReadonly = useMemo(() => type !== 'readonly', [type]);

  const classNameSet = useMemo(() => {
    let className = '';
    if (label) {
      className += 'custom-input-container';
    }
    if (icon) {
      if (label) className += ' ';
      className += `${iconRight ? 'icon-right' : 'icon-adding'}`;
    }
    if (readOnly) className += ' readonly';
    return className;
  }, [label, icon, readOnly, iconRight]);
  const props = useMemo(
    () => ({
      'data-testid': 'input',
      className: isReadonly ? error && 'input-validation-error' : '',
      placeholder: placeholder,
      disabled: disabled,
      readOnly: readOnly,
    }),
    [isReadonly, error, placeholder, disabled, readOnly],
  );

  const textareaProps = useMemo(
    () => ({
      height: height,
      rows: rows,
      cols: cols,
    }),
    [height, rows, cols],
  );

  const input = useMemo(() => {
    switch (type) {
      case 'radio':
        return (
          <CustomRadio
            {...props}
            name={register?.name ?? ''}
            customChangeEvent={customChangeEvent}
            options={options}
            type={type}
          />
        );

      case 'textarea':
        return (
          <CustomTextArea
            {...props}
            {...textareaProps}
            name={fieldName}
            onKeyDownEvent={onKeyDownEvent}
          />
        );
      case 'select':
        return (
          <CustomSelect
            {...props}
            isRequired={isRequired}
            name={fieldName}
            options={options}
            isAutocomplete={isAutocomplete}
            mode={mode}
            allowClear={allowClear}
            handleSelectionChange={handleSelectionChange}
            dropDownStyle={dropDownStyle}
            listHeight={listHeight}
          ></CustomSelect>
        );
      case 'date':
        return (
          <CustomDatePicker
            noPastDates={noPastDates}
            {...props}
            name={fieldName}
            disableDatesFrom={disableDatesFrom}
            disableDatesAfter={disableDatesAfter}
          />
        );
      case 'readonly':
        return <div className='readonly'>{value || <>&nbsp;</>}</div>;
      case 'time':
        return (
          <CustomTimePicker {...props} name={fieldName} selectedStartTime={selectedStartTime} />
        );
      default:
        return (
          <CustomTextInput
            {...props}
            name={fieldName}
            icon={icon || ''}
            type={type}
            autoWidth={autoWidth}
            onKeyDownEvent={onKeyDownEvent}
            maxLength={maxLength}
            onBlur={onBlur}
            onTextChange={onTextChange}
          />
        );
    }
  }, [
    type,
    props,
    register?.name,
    customChangeEvent,
    options,
    textareaProps,
    fieldName,
    isRequired,
    isAutocomplete,
    mode,
    allowClear,
    noPastDates,
    disableDatesFrom,
    disableDatesAfter,
    value,
    icon,
    autoWidth,
    maxLength,
    onKeyDownEvent,
  ]);
  return (
    <div className={`custom-input ${width}`}>
      <div className={classNameSet}>
        {label && (
          <label
            data-testid='input-label'
            className={`label ${isReadonly && error && 'font-validation-error'} ${
              isRequired && 'required'
            }`}
          >
            {label}
          </label>
        )}
        {input}
      </div>
      {isReadonly && error?.message && <Validation message={error.message!} />}
    </div>
  );
};

export default CustomInput;
