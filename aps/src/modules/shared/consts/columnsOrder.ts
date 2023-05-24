/**
 * @module ColumnOrders
 */

import { Position, SettingsPageItem } from '../../main/pages/settings/consts/interfaces';
/**
 *
 * @param keys Additional properties to be rendered in the table (e.g. )
 * @returns Order of columns for a Settings Page (e.g. Articles, Customers)
 */
const baseColumnOrder = (keys: (keyof SettingsPageItem)[] = []): (keyof SettingsPageItem)[] => [
  'code',
  'name',
  ...keys,
  'isActive',
];
/**
 * Settings columns order with no additional properties
 */
export const settingsColumnsOrder: (keyof SettingsPageItem)[] = baseColumnOrder();
/** Settings columns order for parameters page */
export const parametersColumnOrder: (keyof SettingsPageItem)[] = baseColumnOrder(['unit']);
/** Settings columns order for customers page */
export const customersColumnOrder: (keyof SettingsPageItem)[] = baseColumnOrder(['country']);
/** Settings columns order for position page */
export const columnsOrderPositions: (keyof Position)[] = ['name', 'isActive'];
/** Settings columns order for holidays page */
export const holidayColumnOrder: (keyof SettingsPageItem)[] = [
  'holidayDate',
  ...columnsOrderPositions,
];
