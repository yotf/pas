/**
 * @module HolidayStates
 */
import { SettingsPagesResponse } from '../../consts/interfaces';
/**
 * Initial state for {@link HolidaysSlice}
 */
export const initialSettingsState: SettingsPagesResponse = {
  loading: true,
  error: undefined,
  data: [],
  filtered: [],
};
