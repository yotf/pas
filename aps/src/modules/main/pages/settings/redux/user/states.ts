/**
 * @module UserStates
 */
import { UsersResponse } from './interfaces';
/**
 * Initial state for {@link UsersSlice}
 */
export const initialUsersResponseState: UsersResponse = {
  loading: true,
  data: [],
  filtered: [],
  roles: [],
  error: undefined,
};
