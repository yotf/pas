/**
 * @module SettingsInterfaces
 */

import BaseResponse from '@/modules/shared/services/interfaces';

export interface Position {
  id: number;
  name: string;
  isActive?: boolean;
}

export interface SettingsPageId extends SettingsPageItem {
  id: number;
}

export interface SettingsPageItem {
  id?: number;
  code?: string;
  name: string;
  unit?: string;
  country?: string;
  holidayDate?: string;
  isActive?: boolean;
}
export interface SettingsValidationError {
  code: string;
  description: string;
}

export interface SettingsPagesResponse extends BaseResponse {
  data: SettingsPageItem[];
  filtered: SettingsPageItem[];
  validationErrors?: SettingsValidationError[];
}

export interface PositionsResponse extends BaseResponse {
  data: Position[];
  filtered: Position[];
}
