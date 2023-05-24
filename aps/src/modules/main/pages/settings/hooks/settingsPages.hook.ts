/**
 * @module useSettingsPages
 */

import { StoreType } from '@/store';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { AsyncThunk, CombinedState } from '@reduxjs/toolkit';
import { useEffect } from 'react';
import { useForm, UseFormReturn } from 'react-hook-form';
import { PositionsResponse, SettingsPagesResponse } from '../consts/interfaces';

export interface UseSettingsPagesHookType<T> {
  filtered: T[];
  loading: boolean | undefined;
  form: UseFormReturn<{ search: string }, any>;
}
/**
 * @template T Type of entity rendered in the table
 * @param getCallback Thunk used for getting all entities for the API
 * @param filterCallback Reducer used for filtering data in Redux
 * @param stateDirectory Redux state used for the settings page table
 * Dispatches readThunk and fetches all data for the table, filters data in redux
 * @returns Filtered data to be used in the table, loading state and search form
 */
export const useSettingsPages = <T extends object>(
  getCallback: AsyncThunk<T[], number | undefined, any>,
  filterCallback: (payload: string) => {
    payload: string;
    type: string;
  },
  stateDirectory: (state: CombinedState<StoreType>) => SettingsPagesResponse | PositionsResponse,
): UseSettingsPagesHookType<T> => {
  const dispatch = useAppDispatch();
  const form = useForm<{ search: string }>({
    defaultValues: {
      search: '',
    },
  });
  const { search } = form.watch();

  useEffect(() => {
    dispatch(filterCallback(search));
  }, [search, dispatch, filterCallback]);
  const { filtered, loading } = useAppSelector(stateDirectory);

  useEffect(() => {
    dispatch(getCallback());
  }, [dispatch, getCallback]);

  return {
    loading,
    filtered: filtered as T[],
    form,
  };
};
