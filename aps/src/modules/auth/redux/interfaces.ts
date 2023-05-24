/**
 * @module AuthInterfaces
 */

import BaseResponse from '@/modules/shared/services/interfaces';

export interface Login {
  userName: string;
  password: string;
}

export interface LoginResponse extends BaseResponse {
  token: string | null;
}
