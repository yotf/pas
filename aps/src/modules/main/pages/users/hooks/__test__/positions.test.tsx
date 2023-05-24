import { mockedData } from '@/modules/shared/test-config/helpers/consts/sharedMocks';
import { renderHook } from '@testing-library/react';
import { describe } from 'vitest';
import * as hooks from '../options';
import { usePositions, useUserPositions } from '../positions';

describe('usePositions test', () => {
  it('should return values when given options', () => {
    vi.spyOn(hooks, 'useOptions').mockImplementation(() => ({
      entities: mockedData,
      options: [],
    }));
    const { result } = renderHook(() => usePositions());
    expect(result.current.positions).toHaveLength(2);
  });
});

describe('useUserPosition test', () => {
  it('should return values when given options', () => {
    vi.spyOn(hooks, 'useOptions').mockImplementation(() => ({
      entities: mockedData,
      options: [],
    }));
    const { result } = renderHook(() => useUserPositions(2));
    expect(result.current.positions).toHaveLength(2);
  });
});
