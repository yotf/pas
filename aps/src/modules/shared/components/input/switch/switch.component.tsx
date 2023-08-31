/**
 * @module SwitchInput
 */

import { Switch } from 'antd';
import { FC } from 'react';
import { useController, useFormContext } from 'react-hook-form';
import { SwitchInput } from '../interfaces';
import './switch.scss';
/**
 *
 * @returns A switch component
 */
const CustomSwitch: FC<SwitchInput> = ({ label, name, disabled }) => {
  const { control } = useFormContext();
  const { field } = useController({ name, control });

  return (
    <div className='custom-switch'>
      <label data-testid='input-label' className={'label'}>
        {label}
      </label>
      <Switch {...field} checked={field.value} disabled={disabled ? true : false}></Switch>
    </div>
  );
};

export default CustomSwitch;
