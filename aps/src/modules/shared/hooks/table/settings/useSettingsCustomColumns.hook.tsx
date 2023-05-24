/**
 * @module useSettingsCustomColumns
 */

import { ReactNode } from 'react';

export interface ActiveItem {
  isActive?: boolean;
}
/**
 * Returns custom columns used in settings pages
 */
export const useSettingsCustomColumns = <Item extends ActiveItem>(
  translate: (value: string, options?: Record<string, string> | undefined) => string,
): Partial<Record<keyof Item, (value: any) => ReactNode>> => {
  const res = {
    isActive: (value: boolean) => (
      <span className={value ? 'green-color' : 'gray-light'}>
        {translate(value ? 'active' : 'inactive')}
      </span>
    ),
  } as Partial<Record<keyof Item, (value: any) => ReactNode>>;
  return res;
};
