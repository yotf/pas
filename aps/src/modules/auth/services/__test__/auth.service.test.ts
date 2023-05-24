import { ROLE_ADMINISTRATOR } from '@/modules/shared/consts/roles';
import { authParam } from '@/modules/shared/test-config/helpers/authToken';
import { jwtDecodeObject } from '@/modules/shared/test-config/helpers/jwt-decode-mock';
import { AUTHORIZATION_KEY, ROLE_KEY } from '../../redux/consts';
import { getJwt, getRole, isAuthenticated, setAuth, setJwt } from '../auth.service';

afterEach(() => {
  localStorage.clear();
  vi.clearAllMocks();
});

vi.mock('jwt-decode', () => ({ default: vi.fn(() => jwtDecodeObject) }));

describe('auth service', () => {
  it('set authentication with auth param', () => {
    setAuth(authParam);
    expect(localStorage.getItem(AUTHORIZATION_KEY)).toBe(authParam.token);
    expect(localStorage.getItem(ROLE_KEY)).toBe(ROLE_ADMINISTRATOR);
  });

  describe('SetJwt', () => {
    it('set jwt with value', () => {
      setJwt(authParam.token);
      expect(localStorage.getItem(AUTHORIZATION_KEY)).toEqual(authParam.token);
    });

    it('set jwt without value', () => {
      setJwt(null);
      expect(localStorage.getItem(AUTHORIZATION_KEY)).toBeNull();
    });
  });

  describe('isAuthenticated', () => {
    it('is authenticated success', () => {
      setJwt(authParam.token);
      expect(isAuthenticated()).toBeTruthy();
    });

    it('is authenticated failded', () => {
      expect(isAuthenticated()).not.toBeTruthy();
    });
  });

  describe('getJwt', () => {
    it('get jwt successfull', () => {
      setJwt(authParam.token);
      expect(getJwt()).toEqual(authParam.token);
    });
    it('get jwt failed', () => {
      expect(getJwt()).not.toBeTruthy();
    });
  });

  describe('getRole', () => {
    it('get role successfull', () => {
      setAuth(authParam);
      expect(getRole()).toEqual(ROLE_ADMINISTRATOR);
    });
    it('get role failed', () => {
      expect(getRole()).not.toEqual(ROLE_ADMINISTRATOR);
    });
  });
});
