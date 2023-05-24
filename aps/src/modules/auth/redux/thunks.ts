/**
 * @module AuthThunks
 */

import ApiService from '@/modules/shared/services/api.service';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { getJwt } from '../services/auth.service';
import { LOGIN_API, REFRESH_TOKEN_API } from '../consts/apiUrl';
import { Login, LoginResponse } from './interfaces';

/**
 * Sends Login data. Returns a JWT. See more about the used data types {@link AuthInterfaces | here}.
 */
export const loginThunk = createAsyncThunk(LOGIN_API, async (login: Login, { rejectWithValue }) => {
  try {
    const response = await ApiService.post<LoginResponse>(LOGIN_API, login);
    return response.data;
  } catch (err: any) {
    return rejectWithValue(err.response ? err.response.status : err.message);
  }
});

/**
 * Resends JWT in order to refresh it. Uses {@link AuthService.getJwt | getJwt} to get the token from local storage and resend it.
 */
export const resetTokenThunk = createAsyncThunk(
  REFRESH_TOKEN_API,
  async (_, { rejectWithValue }) => {
    try {
      const response = await ApiService.post<LoginResponse>(REFRESH_TOKEN_API + getJwt());
      return response.data;
    } catch (err: any) {
      return rejectWithValue(err.response ? err.response.status : err.message);
    }
  },
);
