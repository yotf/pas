import { renderHook } from '@testing-library/react';
import { describe } from 'vitest';
import { Role } from '../../../settings/redux/user/interfaces';
import { useOptions } from '../options';
import * as storeHooks from '../../../../../../store/hooks';
import { mockedRoles } from '@/modules/shared/test-config/helpers/consts/sharedMocks';

const mockDispatch = vi.fn();
vi.mock('react-redux', () => ({
  useSelector: vi.fn(),
  useDispatch: () => mockDispatch,
}));

describe('useOptions test', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });
  afterEach(() => {
    vi.restoreAllMocks();
  });
  const mockedThunk: any = vi.fn() as any;

  it('should return values if there are entities in selector and map them properly', () => {
    vi.spyOn(storeHooks, 'useAppSelector').mockImplementation((): Role[] => mockedRoles);

    const { result } = renderHook(() =>
      useOptions({ selector: () => mockedRoles, thunk: mockedThunk }),
    );
    expect(result.current.options).toHaveLength(1);
    expect(result.current.options[0]).toHaveProperty('label');
    expect(mockedThunk).not.toHaveBeenCalled();
  });

  it('should call thunk if no entities are in selector', () => {
    vi.spyOn(storeHooks, 'useAppSelector').mockImplementation((): Role[] => []);
    renderHook(() => useOptions({ selector: () => [], thunk: mockedThunk }));
    expect(mockedThunk).toHaveBeenCalled();
  });
});
