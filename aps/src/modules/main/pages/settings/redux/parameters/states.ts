/**
 * @module ParametersStates
 */
import { SettingsPagesResponse } from '../../consts/interfaces';
/**
 * Initial state for {@link ParametersSlice}
 */
export const initialSettingsState: SettingsPagesResponse = {
  loading: true,
  error: undefined,
  data: [],
  filtered: [],
};
