import { FC } from 'react';
import { SwitchInput } from '../interfaces';

import { useController, useFormContext } from 'react-hook-form';
import { Checkbox } from 'antd';
import './checkbox.scss';

const CustomCheckBox: FC<SwitchInput> = ({ label, name }) => {
  const { control } = useFormContext();
  const { field } = useController({ name, control });

  return (
    <div className='custom-checkbox'>
      <Checkbox {...field} checked={field.value}></Checkbox>
      <label data-testid='input-label' className={label}>
        {label}
      </label>
    </div>
  );
};

export default CustomCheckBox;
