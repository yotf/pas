/**
 * @module SizeRangesStates
 */
import { SettingsPagesResponse } from '../../consts/interfaces';
/**
 * Initial state for {@link SizeRangesSlice}
 */
export const initialSettingsState: SettingsPagesResponse = {
  loading: true,
  error: undefined,
  data: [],
  filtered: [],
};
