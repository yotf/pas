/**
 * @module PositionsStates
 */
import { SettingsPagesResponse } from '../../consts/interfaces';
/**
 * Initial state for {@link PositionsSlice}
 */
export const initialSettingsState: SettingsPagesResponse = {
  loading: true,
  error: undefined,
  data: [],
  filtered: [],
};
