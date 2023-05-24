/**
 * @module DropdownInterface
 */

import { MenuProps } from 'antd';

export interface DropdownProps {
  text: string;
  items: MenuProps['items'];
  label?: string;
}
