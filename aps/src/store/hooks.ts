import { AnyAction, Dispatch, ThunkDispatch } from '@reduxjs/toolkit';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from './';

type AppDispatchType = ThunkDispatch<RootState, null, AnyAction> & Dispatch<AnyAction>;
export const useAppDispatch = (): AppDispatchType => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
