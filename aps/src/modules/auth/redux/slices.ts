/**
 * @module AuthSlice
 */

import { createSlice } from '@reduxjs/toolkit';
import { logout, setAuth, setJwt } from '../services/auth.service';
import { initialLoginResponseState } from './states';
import { loginThunk, resetTokenThunk } from './thunks';

/**
 *
 */
const authSlice = createSlice({
  name: 'authSlice',
  initialState: initialLoginResponseState,
  reducers: {
    /**
     *
     * @returns Clears out JWT values from the state and local storage
     */
    logoutAction: (state) => {
      logout();
      state.token = null;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(loginThunk.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(loginThunk.fulfilled, (state, action) => {
      state.loading = false;
      state.token = action.payload.token;
      setAuth(state);
      state.error = undefined;
    });
    builder.addCase(loginThunk.rejected, (state, action) => {
      state.loading = false;
      state.token = null;
      logout();
      state.error = action.error.message;
    });
    builder.addCase(resetTokenThunk.fulfilled, (state, action) => {
      state.token = action.payload.token;
      setJwt(state.token);
    });
    builder.addCase(resetTokenThunk.rejected, (state) => {
      state.token = null;
      logout();
    });
  },
});

export const { logoutAction } = authSlice.actions;
export const authReducer = authSlice.reducer;
