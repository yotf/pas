/**
 * @module DepartmentStates
 */

import { SettingsPagesResponse } from '../../consts/interfaces';
/**
 * Initial state for {@link DepartmentsSlice}
 */
export const initialSettingsState: SettingsPagesResponse = {
  loading: true,
  error: undefined,
  data: [],
  filtered: [],
};
