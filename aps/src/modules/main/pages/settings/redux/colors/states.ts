/**
 * @module ColorsStates
 */

import { SettingsPagesResponse } from '../../consts/interfaces';
/**
 * Initial state for {@link ColorsSlice}
 */
export const initialSettingsState: SettingsPagesResponse = {
  loading: true,
  error: undefined,
  data: [],
  filtered: [],
};
