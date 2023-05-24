/**
 * @module CustomersStates
 */

import { SettingsPagesResponse } from '../../consts/interfaces';
/**
 * Initial state for {@link CustomersSlice}
 */
export const initialSettingsState: SettingsPagesResponse = {
  loading: true,
  error: undefined,
  data: [],
  filtered: [],
};
