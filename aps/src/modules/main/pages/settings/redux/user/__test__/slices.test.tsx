import { setLanguage } from '@/localizations/i18n';
import { UsersResponse } from '../interfaces';
import { filterUsers, usersReducer } from '../slices';
import { initialUsersResponseState } from '../states';
import { getAllUsers } from '../thunks';
import { mockedData, mockedDataFilter } from './consts';

test('should return the initial state', () => {
  expect(usersReducer(undefined, { type: undefined })).toEqual({
    loading: true,
    error: undefined,
    data: [],
    filtered: [],
    roles: [],
  });
});

test('should filter an array', async () => {
  setLanguage('en');
  const previousState: UsersResponse = {
    data: mockedData,
    filtered: mockedData,
    roles: [],
  };

  const users = await usersReducer(previousState, filterUsers(mockedDataFilter[0].email));

  expect(users).toEqual({
    filtered: [mockedData[0]],
    data: mockedData,
    roles: [],
  });
});

test('Fetch users fulfilled', async () => {
  setLanguage('en');
  const action = { type: getAllUsers.fulfilled.type, payload: mockedData };
  const state = usersReducer(initialUsersResponseState, action);
  expect(state.loading).not.toBeTruthy();
  expect(state.error).toBe(undefined);
  expect(state.data).toEqual(mockedData);
  expect(state.filtered).toEqual(state.data);
});

test('Fetch unit of measures rejected', async () => {
  const expectedWithError = {
    message: 'error message',
  };
  const action = { type: getAllUsers.rejected.type, error: expectedWithError };
  const state = usersReducer(initialUsersResponseState, action);
  expect(state.loading).not.toBeTruthy();
  expect(state.error).toEqual(expectedWithError.message);
  expect(state.data).toEqual([]);
  expect(state.filtered).toEqual(state.data);
});
