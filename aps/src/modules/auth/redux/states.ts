/**
 * @module AuthState
 */

import { AUTHORIZATION_KEY } from './consts';
import { LoginResponse } from './interfaces';

/**
 * Initial {@link AuthSlice | Auth Slice} state
 */
export const initialLoginResponseState: LoginResponse = {
  loading: false,
  error: undefined,
  token: localStorage.getItem(AUTHORIZATION_KEY) || null,
};
