import { renderHook } from '@testing-library/react';
import { UseFormReturn } from 'react-hook-form';
import { describe, it, vi } from 'vitest';
import * as storeHooks from '../../../../../../store/hooks';
import { UserFormData } from '../../../settings/redux/user/interfaces';
import { useUserFormErrors } from '../user-form-errors';

const mockForm = (): UseFormReturn<UserFormData, any> => {
  const form = {
    clearErrors: () => {},
    setError: (field: string, value: string) => {
      form.formState.errors[field] = value;
    },
    watch: () => ({ userName: '', email: '' }),
    formState: {
      errors: {},
    },
  } as any;
  return form;
};

describe('user form errors', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });
  afterEach(() => {
    vi.restoreAllMocks();
  });
  it('should have no errors', () => {
    vi.spyOn(storeHooks, 'useAppSelector').mockImplementation((): object => ({
      validationErrors: [],
    }));
    const form = mockForm();
    const { result } = renderHook(() => useUserFormErrors(form, false));
    expect(result.current.formState.errors).toEqual({});
  });
  it('should have DuplicateUserName errors', () => {
    vi.spyOn(storeHooks, 'useAppSelector').mockImplementation((): object => ({
      validationErrors: [{ code: 'DuplicateUserName' }],
    }));
    const form = mockForm();
    const { result } = renderHook(() => useUserFormErrors(form, false));
    expect(result.current.formState.errors.userName).toBeTruthy();
  });
  it('should have DuplicateEmail errors', () => {
    vi.spyOn(storeHooks, 'useAppSelector').mockImplementation((): object => ({
      validationErrors: [{ code: 'DuplicateEmail' }],
    }));
    const form = mockForm();
    const { result } = renderHook(() => useUserFormErrors(form, false));
    expect(result.current.formState.errors.email).toBeTruthy();
  });
});
