import { getDispatch } from '@/modules/shared/test-config/helpers/dispatchHelper';
import { jwtDecodeObject } from '@/modules/shared/test-config/helpers/jwt-decode-mock';
import axiosInstance from '@/services/setup/api';
import { Login, LoginResponse } from '../interfaces';
import { loginThunk, resetTokenThunk } from '../thunks';

const request: Login = {
  userName: 'userName',
  password: 'password',
};

const expected: LoginResponse = {
  token: 'token',
  loading: false,
  error: undefined,
};

const errorMessage = 'error message';

vi.mock('jwt-decode', () => ({ default: vi.fn(() => jwtDecodeObject) }));

describe('auth thunk', () => {
  it('login success', async () => {
    const postSpy = vi.spyOn(axiosInstance, 'post').mockResolvedValueOnce({
      data: expected,
    });

    const dispatch = getDispatch();
    const response = await dispatch(loginThunk(request));
    const result: LoginResponse = response.payload as LoginResponse;
    expect(result.token).toEqual(expected.token);
    expect(postSpy).toHaveBeenCalled();
  });

  it('login failed', async () => {
    const postSpy = vi
      .spyOn(axiosInstance, 'post')
      .mockImplementation(() => Promise.reject(new Error(errorMessage)));
    const dispatch = getDispatch();
    const response = await dispatch(loginThunk(request));
    expect(response.payload).toEqual(errorMessage);
    expect(postSpy).toHaveBeenCalled();
  });

  it('refresh token success', async () => {
    const postSpy = vi.spyOn(axiosInstance, 'post').mockResolvedValueOnce({
      data: expected,
    });
    const dispatch = getDispatch();
    const response = await dispatch(resetTokenThunk());
    const result: LoginResponse = response.payload as LoginResponse;
    expect(result.token).toEqual(expected.token);
    expect(postSpy).toHaveBeenCalled();
  });

  it('refresh token failed', async () => {
    const postSpy = vi
      .spyOn(axiosInstance, 'post')
      .mockImplementation(() => Promise.reject(new Error(errorMessage)));
    const dispatch = getDispatch();
    const response = await dispatch(resetTokenThunk());
    expect(response.payload).toEqual(errorMessage);
    expect(postSpy).toHaveBeenCalled();
  });
});
