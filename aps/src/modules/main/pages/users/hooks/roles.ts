/**
 * @module useRoles
 */

import { DefaultOptionType } from 'antd/lib/select';
import { Role } from '../../settings/redux/user/interfaces';
import { rolesThunk } from '../../settings/redux/user/thunks';
import { useOptions } from './options';

export type UseRolesReturnType = {
  roles: Role[];
  options: DefaultOptionType[];
};
/**
 *
 * @returns Roles values for {@link UserModal} dropdown.
 */
export const useRoles = (): UseRolesReturnType => {
  const { entities: roles, options } = useOptions({
    selector: (state) => state.users.roles,
    thunk: rolesThunk,
  });
  return { roles, options };
};
