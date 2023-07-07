import BaseResponse from '@/modules/shared/services/interfaces';

import { SettingsPagesResponse } from '../../consts/interfaces';
import { Configuration } from './interfaces';
/**
 * Initial state for {@link configurationSlice}
 * 
 * 
 */

export interface ConfigurationResponse extends BaseResponse {
    data: Configuration ;
}
export const initialSettingsState: ConfigurationResponse = {
  loading: true,
  error: undefined,
  data: {quantities1:[],quantities2:[]},

};