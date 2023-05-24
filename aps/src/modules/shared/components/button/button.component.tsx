/**
 * @module Button
 */

import React from 'react';
import { Button } from './interfaces';
import './button.scss';
import { Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
/**
 *
 * @returns A customizable button component
 */
const CustomButton: React.FC<Button> = ({
  color,
  type,
  children,
  onClick,
  isDisabled = false,
  customClass = '',
  isLoading = false,
}) => {
  let classes = !customClass ? 'button' : `button ${customClass}`;
  classes = color ? `${classes} ${color} ${isDisabled && 'disabled'}` : `${classes}`;

  const antIcon = <LoadingOutlined style={{ fontSize: 24, color: 'white' }} spin />;
  const spinner = <Spin data-testid='spinner' indicator={antIcon} />;

  return (
    <button
      data-testid='custom-button'
      disabled={isDisabled || isLoading}
      type={type}
      className={classes}
      onClick={onClick}
    >
      {isLoading ? spinner : children}
    </button>
  );
};

export default CustomButton;
