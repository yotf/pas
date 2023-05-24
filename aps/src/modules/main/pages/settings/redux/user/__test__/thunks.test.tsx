import { mockedRoles } from '@/modules/shared/test-config/helpers/consts/sharedMocks';
import { getDispatch } from '@/modules/shared/test-config/helpers/dispatchHelper';
import axiosInstance from '@/services/setup/api';
import { Role, User, UserFormData } from '../interfaces';
import { deleteUserThunk, getAllUsers, rolesThunk, upsertUserThunk } from '../thunks';
import { errorMessage, mockedData, mockedDataPost, upsertFormData } from './consts';

describe('users thunk', () => {
  it('should return users on success', async () => {
    const getSpy = vi.spyOn(axiosInstance, 'get').mockResolvedValueOnce({ data: mockedData });

    const dispatch = getDispatch();
    const response = await dispatch(getAllUsers());
    const result: User[] = response.payload as User[];
    expect(result).toEqual(mockedData);
    expect(getSpy).toHaveBeenCalled();
  });

  it('should return error on fail', async () => {
    const getSpy = vi
      .spyOn(axiosInstance, 'get')
      .mockImplementation(() => Promise.reject(new Error(errorMessage)));
    const dispatch = getDispatch();
    const response = await dispatch(getAllUsers());
    expect(response.payload).toEqual(errorMessage);
    expect(getSpy).toHaveBeenCalled();
  });
});

describe('roles thunk', () => {
  it('should return roles on success', async () => {
    const getSpy = vi.spyOn(axiosInstance, 'get').mockResolvedValueOnce({ data: mockedRoles });

    const dispatch = getDispatch();
    const response = await dispatch(rolesThunk());
    const result: Role[] = response.payload as Role[];
    expect(result).toEqual(mockedRoles);
    expect(getSpy).toHaveBeenCalled();
  });

  it('should return an error on fail', async () => {
    const getSpy = vi
      .spyOn(axiosInstance, 'get')
      .mockImplementation(() => Promise.reject(new Error(errorMessage)));
    const dispatch = getDispatch();
    const response = await dispatch(rolesThunk());
    expect(response.payload).toEqual(errorMessage);
    expect(getSpy).toHaveBeenCalled();
  });
});

describe('post-put user', async () => {
  it('should put user when given id', async () => {
    const putSpy = vi.spyOn(axiosInstance, 'put').mockResolvedValueOnce({ data: mockedDataPost });
    vi.spyOn(axiosInstance, 'get').mockResolvedValueOnce({ data: mockedData });

    const dispatch = getDispatch();
    const response = await dispatch(upsertUserThunk({ ...upsertFormData, id: mockedDataPost.id }));

    const result: UserFormData = response.payload as UserFormData;
    expect(mockedDataPost.id).toEqual(result.id);
    expect(putSpy).toHaveBeenCalled();
  });

  it('should post user when no id', async () => {
    const postSpy = vi.spyOn(axiosInstance, 'post').mockResolvedValueOnce({ data: mockedDataPost });
    vi.spyOn(axiosInstance, 'get').mockResolvedValueOnce({ data: mockedData });

    const dispatch = getDispatch();
    const response = await dispatch(upsertUserThunk(upsertFormData));

    const result: UserFormData = response.payload as UserFormData;
    expect(mockedDataPost.id).toEqual(result.id);
    expect(postSpy).toHaveBeenCalled();
  });

  it('should return an error on fail', async () => {
    const putSpy = vi
      .spyOn(axiosInstance, 'put')
      .mockImplementation(() => Promise.reject(new Error(errorMessage)));

    const dispatch = getDispatch();
    const response = await dispatch(upsertUserThunk({ ...upsertFormData, id: '1' }));
    const result: UserFormData = response.payload as UserFormData;
    expect(result).toEqual(errorMessage);
    expect(putSpy).toHaveBeenCalled();
  });
});

describe('delete user', async () => {
  it('should delete user on success', async () => {
    const deleteSpy = vi
      .spyOn(axiosInstance, 'delete')
      .mockResolvedValueOnce({ data: mockedDataPost.id });

    const dispatch = getDispatch();
    const response = await dispatch(deleteUserThunk(upsertFormData.id));

    const result: unknown = response.payload;
    expect(result).toEqual(upsertFormData.id);
    expect(deleteSpy).toHaveBeenCalled();
  });

  it('should return error on fail', async () => {
    const deleteSpy = vi
      .spyOn(axiosInstance, 'delete')
      .mockImplementation(() => Promise.reject(new Error(errorMessage)));
    const dispatch = getDispatch();
    const response = await dispatch(deleteUserThunk(upsertFormData.id));
    expect(response.payload).toEqual(errorMessage);
    expect(deleteSpy).toHaveBeenCalled();
  });
});

test('users delete', async () => {
  const deleteSpy = vi
    .spyOn(axiosInstance, 'delete')
    .mockResolvedValueOnce({ data: mockedDataPost.id });

  const dispatch = getDispatch();
  const response = await dispatch(deleteUserThunk(upsertFormData.id));

  const result: unknown = response.payload;
  expect(result).toEqual(upsertFormData.id);
  expect(deleteSpy).toHaveBeenCalled();
});

test('users delete failed', async () => {
  const deleteSpy = vi
    .spyOn(axiosInstance, 'delete')
    .mockImplementation(() => Promise.reject(new Error(errorMessage)));
  const dispatch = getDispatch();
  const response = await dispatch(deleteUserThunk(upsertFormData.id));
  expect(response.payload).toEqual(errorMessage);
  expect(deleteSpy).toHaveBeenCalled();
});
