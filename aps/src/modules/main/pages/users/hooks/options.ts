/**
 * @module useUserOptions
 */

import { StoreType } from '@/store';
import { AsyncThunk } from '@reduxjs/toolkit';
import { DefaultOptionType } from 'antd/lib/select';
import { useEffect, useMemo } from 'react';
import { useAppDispatch, useAppSelector } from '../../../../../store/hooks';

export interface NamedEntity {
  id?: number;
  name: string;
}

export type UseOptionsProps<T> = {
  selector: (state: StoreType) => T[];
  thunk: AsyncThunk<T[], number | undefined, any>;
};

export type UseOptionsReturnType<T> = {
  entities: T[];
  options: DefaultOptionType[];
};
/**
 *
 * @param selector Redux values to be mapped
 * @param thunk Redux thunk used to get the data
 * @returns Selected data mapped and prepared for Select and Radio inputs
 */
export const useOptions = <T extends NamedEntity>({
  selector,
  thunk,
}: UseOptionsProps<T>): UseOptionsReturnType<T> => {
  const dispatch = useAppDispatch();
  const entities = useAppSelector(selector);
  useEffect(() => {
    if (!entities.length) {
      dispatch(thunk());
    }
  }, [dispatch, entities, thunk]);
  const options = useMemo(() => entities.map((e) => ({ value: e.id, label: e.name })), [entities]);
  return { entities, options };
};
