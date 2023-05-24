/**
 * @module Dropdown
 */

import { FC } from 'react';
import { Dropdown } from 'antd';
import { DropdownProps } from './interfaces';
import './dropDown.scss';
import arrowDown from '../../../../assets/arrow-down.png';
/** A dropdown component*/
const DropDown: FC<DropdownProps> = ({ text, items, label }) => {
  return (
    <div className='dropdown-container'>
      {label && <label>{label}</label>}
      <Dropdown data-testid='dropdown-ant' className='dropdown' placement='bottom' menu={{ items }}>
        <div data-testid='dropdown-menu'>
          <span>{text}</span>
          <img data-testid='dropdown-image' src={arrowDown} alt='arrow' />
        </div>
      </Dropdown>
    </div>
  );
};

export default DropDown;
