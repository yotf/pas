/**@module DispatchHelperTestMock */
import { setupStore } from '@/store';
import { AnyAction, EnhancedStore } from '@reduxjs/toolkit';
import { Dispatch } from 'react';
import { ThunkDispatch, ThunkMiddleware } from 'redux-thunk';
/**Mocked dispatch function used for tests */
export function getDispatch(): ThunkDispatch<any, undefined, AnyAction> & Dispatch<AnyAction> {
  const store: EnhancedStore<any, AnyAction, [ThunkMiddleware<any, AnyAction, undefined>]> =
    setupStore();
  const { dispatch } = store;
  return dispatch;
}
