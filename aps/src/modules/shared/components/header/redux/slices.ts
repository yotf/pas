/**
 * @module HeaderSlice
 */

import { createSlice } from '@reduxjs/toolkit';
import { InitialState } from './interfaces';

const initialState: InitialState = {
  sideMenu: false,
};

const sideMenu = createSlice({
  name: 'sideMenu',
  initialState,
  reducers: {
    toggleMenu: (state) => {
      state.sideMenu = !state.sideMenu;
    },
  },
});
export const sideMenuReducer = sideMenu.reducer;
export const { toggleMenu } = sideMenu.actions;
