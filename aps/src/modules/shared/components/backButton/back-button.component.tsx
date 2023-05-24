/**
 * @module BackButton
 */

import { LeftOutlined } from '@ant-design/icons';
import { FC } from 'react';
import './back-button.scss';

export type BackButtonProps = {
  onClick?: () => void;
};
/**
 *
 * @param onClick Callback that happens when back button is clicked
 * @returns Back button component
 */
const BackButton: FC<BackButtonProps> = ({ onClick }) => {
  return (
    <button className='back-button' onClick={onClick} data-testid='back-button'>
      <LeftOutlined />
    </button>
  );
};

export default BackButton;
