/**
 * @module UsersHook
 */

import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { useEffect, useMemo } from 'react';
import { useForm, UseFormReturn } from 'react-hook-form';
import { UserMapped } from '../settings/redux/user/interfaces';
import { filterUsers } from '../settings/redux/user/slices';
import { getAllUsers } from '../settings/redux/user/thunks';

export interface UseUsersType {
  uiData: UserMapped[];
  loading: boolean | undefined;
  form: UseFormReturn<{ search: string }, any>;
}
/**
 *
 * @returns Users data from redux mapped and users form
 */
export const useUsers = (): UseUsersType => {
  const dispatch = useAppDispatch();
  const form = useForm<{ search: string }>({
    defaultValues: {
      search: '',
    },
  });
  const { search } = form.watch();

  useEffect(() => {
    dispatch(filterUsers(search));
  }, [search, dispatch]);
  const { filtered, loading } = useAppSelector((state) => state.users);

  const uiData: UserMapped[] = useMemo(
    () =>
      filtered.map(
        (obj): UserMapped => ({
          id: obj.id,
          firstName: obj.firstName,
          lastName: obj.lastName,
          email: obj.email,
          positionName: obj.position?.name,
          roleName: obj.role?.name,
          isActive: obj.isActive,
        }),
      ),
    [filtered],
  );

  useEffect(() => {
    dispatch(getAllUsers());
  }, [dispatch]);

  return {
    loading,
    uiData,
    form,
  };
};
