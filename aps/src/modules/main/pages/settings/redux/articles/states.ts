/**
 * @module ArticlesStates
 */

import { SettingsPagesResponse } from '../../consts/interfaces';
/**
 * Initial state for {@link ArticlesSlice}
 */
export const initialSettingsState: SettingsPagesResponse = {
  loading: true,
  error: undefined,
  data: [],
  filtered: [],
};
