/**
 * @module UsersSlice
 */

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ChangeHistoryDto } from '../change-history.dto';
import { ValidationError } from '../validation-error.type';
import { User } from './interfaces';
import { initialUsersResponseState } from './states';
import { deleteUserThunk, getAllUsers, rolesThunk, upsertUserThunk } from './thunks';

const setDateMilliseconds = (changeHistoryDto: ChangeHistoryDto): number => {
  const minimumDate = '0001-01-01T00:00:00';
  const dateCreatedToString =
    changeHistoryDto.createdOn === minimumDate ? undefined : changeHistoryDto.createdOn;
  const defineDate = dateCreatedToString ?? changeHistoryDto.updatedOn ?? minimumDate;
  return new Date(defineDate).getTime();
};

const sortByDate = (a: User, b: User): any => {
  return setDateMilliseconds(b.changeHistoryDto) - setDateMilliseconds(a.changeHistoryDto);
};

const usersSlice = createSlice({
  name: 'usersSlice',
  initialState: initialUsersResponseState,
  reducers: {
    filterUsers: (state, action: PayloadAction<string>) => {
      state.filtered = state.data.filter((user: User) => {
        return (
          user.firstName.toLocaleLowerCase().includes(action.payload) ||
          user.lastName.toLocaleLowerCase().includes(action.payload) ||
          user.email.toLocaleLowerCase().includes(action.payload) ||
          user.position?.name.toLocaleLowerCase().includes(action.payload)
        );
      });
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getAllUsers.fulfilled, (state, action) => {
      state.loading = false;
      state.data = action.payload.slice().sort(sortByDate);
      state.filtered = state.data;
      state.error = undefined;
    });
    builder.addCase(getAllUsers.rejected, (state, action) => {
      state.loading = false;
      state.data = [];
      state.error = action.error.message;
    });
    builder.addCase(rolesThunk.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(rolesThunk.fulfilled, (state, action) => {
      state.loading = false;
      state.roles = action.payload;
      state.error = undefined;
    });
    builder.addCase(rolesThunk.rejected, (state, action) => {
      state.loading = false;
      state.roles = [];
      state.error = action.error.message;
    });
    builder.addCase(upsertUserThunk.pending, (state) => {
      state.loading = true;
      state.error = undefined;
      state.validationErrors = undefined;
    });
    builder.addCase(upsertUserThunk.fulfilled, (state) => {
      state.loading = false;
      state.error = undefined;
    });
    builder.addCase(upsertUserThunk.rejected, (state, action: any) => {
      state.loading = false;
      state.error = action.error.message;
      if (action.payload.type === 'validationErrors') {
        state.validationErrors = action.payload.errors as ValidationError[];
      }
    });
    builder.addCase(deleteUserThunk.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(deleteUserThunk.fulfilled, (state, action) => {
      state.loading = false;
      state.error = undefined;
      state.data = state.data.filter(({ id }) => id !== action.payload);
      state.filtered = state.data;
    });
    builder.addCase(deleteUserThunk.rejected, (state, action: any) => {
      state.loading = false;
      state.error = action.error.message;
    });
  },
});

export const { filterUsers } = usersSlice.actions;

export const usersReducer = usersSlice.reducer;
