/**
 * @module OrderTypesStates
 */
import { SettingsPagesResponse } from '../../consts/interfaces';
/**
 * Initial state for {@link OrderTypesSlice}
 */
export const initialSettingsState: SettingsPagesResponse = {
  loading: true,
  error: undefined,
  data: [],
  filtered: [],
};
