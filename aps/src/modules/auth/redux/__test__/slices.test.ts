import { AUTHORIZATION_KEY } from '@/modules/auth/redux/consts';
import { jwtDecodeObject } from '@/modules/shared/test-config/helpers/jwt-decode-mock';
import { LoginResponse } from '../interfaces';
import { authReducer } from '../slices';
import { initialLoginResponseState } from '../states';
import { loginThunk, resetTokenThunk } from '../thunks';

vi.mock('jwt-decode', () => ({ default: vi.fn(() => jwtDecodeObject) }));

const expected: LoginResponse = {
  token: 'token',
  loading: false,
  error: undefined,
};

const expectedWithError = {
  message: 'error message',
};

describe('auth slices', () => {
  describe('login slices', () => {
    it('on pending', async () => {
      const action = { type: loginThunk.pending.type };
      const state = authReducer(initialLoginResponseState, action);
      expect(state.loading).toBeTruthy();
    });

    it('on fulfilled', async () => {
      const action = { type: loginThunk.fulfilled.type, payload: expected };
      const state = authReducer(initialLoginResponseState, action);
      expect(state.loading).not.toBeTruthy();
      expect(state.error).toBe(undefined);
      expect(state.token).toEqual(expected.token);
      expect(localStorage.getItem(AUTHORIZATION_KEY)).toEqual(expected.token);
    });

    it('on rejected', async () => {
      const action = { type: loginThunk.rejected.type, error: expectedWithError };
      const state = authReducer(initialLoginResponseState, action);
      expect(state.token).toBeNull();
      expect(state.error).toEqual(expectedWithError.message);
    });
  });

  describe('reset token slices', () => {
    it('on fulfilled', () => {
      const action = { type: resetTokenThunk.fulfilled.type, payload: expected };
      const state = authReducer(initialLoginResponseState, action);

      expect(state.token).toEqual(expected.token);
      expect(localStorage.getItem(AUTHORIZATION_KEY)).toEqual(expected.token);
    });

    it('on rejected', () => {
      it('on rejected', async () => {
        const action = { type: resetTokenThunk.rejected.type, error: expectedWithError };
        const state = authReducer(initialLoginResponseState, action);
        expect(state.token).toBeNull();
        expect(state.error).toEqual(expectedWithError.message);
      });
    });
  });
});
