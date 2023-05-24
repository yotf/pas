import { mockedData } from '@/modules/shared/test-config/helpers/consts/sharedMocks';
import { renderHook } from '@testing-library/react';
import { describe } from 'vitest';
import * as hooks from '../options';
import { useRoles } from '../roles';

describe('useRoles test', () => {
  it('should return values when given options', () => {
    vi.spyOn(hooks, 'useOptions').mockImplementation(() => ({
      entities: mockedData,
      options: [],
    }));
    const { result } = renderHook(() => useRoles());
    expect(result.current.roles).toHaveLength(2);
  });
});
