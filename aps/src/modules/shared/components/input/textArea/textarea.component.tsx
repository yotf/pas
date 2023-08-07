/**
 * @module TextArea
 */

import TextArea from 'antd/lib/input/TextArea';
import React, { ReactElement } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { trimInput } from '../../../utils/utils';

export type TextAreaProps = {
  /** Used for registering input inside a form */
  name: string;
  /** Changes input styling and makes in uninteractable */
  disabled?: boolean;
  /** Input height in px */
  height?: string;
  /** Number of columns of textarea */
  cols?: number;
  /** Number of rows of textarea */
  rows?: number;

  onKeyDownEvent?: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
};
/**
 * @returns A customizable textarea input
 */
const CustomTextArea: React.FC<TextAreaProps> = ({ name, onKeyDownEvent, ...props }) => {
  const { control } = useFormContext();
  return (
    <Controller
      name={name}
      control={control}
      defaultValue=''
      render={({ field: { onChange, ...field } }): ReactElement<any, any> => (
        <TextArea
          {...field}
          autoComplete='off'
          {...props}
          className='textarea-input'
          autoSize={{ minRows: 6, maxRows: 18 }}
          onKeyDown={onKeyDownEvent}
          onChange={({ target: { value } }): void => {
            onChange(name === 'password' ? value : trimInput(value));
          }}
        />
      )}
    />
  );
};

export default CustomTextArea;
