/**
 * @module useTableData
 */

import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { ActionCreatorWithPayload, AsyncThunk, CombinedState } from '@reduxjs/toolkit';
import { useEffect, useMemo } from 'react';
import { useForm, UseFormReturn } from 'react-hook-form';
import { StoreType } from '../../../../../store';
import { EntityState } from './../../../pages/settings/redux/entity-state.type';
import { IdType } from './../../../pages/settings/redux/thunks';

export interface UseTableDataType<Entity, EntityMapped> {
  loading: boolean | undefined;
  uiData: EntityMapped[];
  data: Entity[];
  form: UseFormReturn<{ search: string; status: number | string | undefined;situation: number | string | undefined }, any>;
}

export interface UseTableDataProps<Entity, EntityMapped, SingleEntity> {
  filterThunk: ActionCreatorWithPayload<string, string>;
  readThunk: AsyncThunk<Entity[], IdType, Record<string, unknown>>;
  stateSelector: (state: CombinedState<StoreType>) => EntityState<Entity, SingleEntity>;
  mapEntityToUiData: (entity: Entity) => EntityMapped;
  additionalFilter?: (data: EntityMapped[]) => EntityMapped[];
}
/**
 * @template Entity type of Entity recieved from the API
 * @template EntityMapped Properties of Entity prepared for the table
 * @template SingleEntity One entity recieved from the API and shown on the Maintain page inside the context.
 * Controls the search input behaviour. Creates a form and on search value change dispatches filterThunk which returns filtered data. Can accept additionalFilter prop to filter data by not just text (by status, for example).
 * @returns Filtered UI data to be shown in the table. Also gets all entities by dispatching the readThunk on initialization.
 */
export const useTableData = <Entity, EntityMapped, SingleEntity>({
  filterThunk,
  readThunk,
  stateSelector,
  mapEntityToUiData,
  additionalFilter,
}: UseTableDataProps<Entity, EntityMapped, SingleEntity>): UseTableDataType<
  Entity,
  EntityMapped
> => {
  const dispatch = useAppDispatch();
  const form = useForm<{ search: string; status: number | string | undefined; situation: number | string | undefined  }>({
    defaultValues: {
      search: '',
      status: 1,
      situation:0,
    },
  });
  const { search } = form.watch();

  useEffect(() => {
    dispatch(filterThunk(search));
  }, [search, dispatch, filterThunk]);

  const { filtered, loading, data } = useAppSelector(stateSelector);
  const filteredByText: EntityMapped[] = useMemo(
    () => filtered.map(mapEntityToUiData),
    [filtered, mapEntityToUiData],
  );

  const uiData = additionalFilter ? additionalFilter(filteredByText) : filteredByText;

  useEffect(() => {
    dispatch(readThunk());
  }, [dispatch, readThunk]);

  return {
    loading,
    uiData,
    data,
    form,
  };
};
