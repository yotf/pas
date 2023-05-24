import { renderHook } from '@testing-library/react';
import * as storeHooks from '../../../../../../store/hooks';
import { mockForm } from '../../../operations/__test__/consts';
import { useWorkCenterFormErrors } from '../useWorkCenterFormErrors';

describe('operation form errors', () => {
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
    const { result } = renderHook(() => useWorkCenterFormErrors(form));
    result.current.clearErrors();
    expect(result.current.formState.errors).toEqual({});
  });
  it('should have name errors', () => {
    vi.spyOn(storeHooks, 'useAppSelector').mockImplementation((): object => ({
      validationErrors: [{ description: 'mocked error' }],
    }));
    const form = mockForm();
    const { result } = renderHook(() => useWorkCenterFormErrors(form));
    expect(result.current.formState.errors.name).toBeTruthy();
  });
});
