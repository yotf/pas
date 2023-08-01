import { renderHook } from '@testing-library/react';
import { test } from 'vitest';
import * as storeHooks from '../../../../../../store/hooks';
import { mockedOperation } from '../../../operations/__test__/consts';
import { useWorkCenterMaintainSetup } from '../useWorkCenterMaintainSetup';

const mockDispatch = vi.fn();
vi.mock('react-redux', () => ({
  useSelector: vi.fn(),
  useDispatch: () => mockDispatch,
}));

test('should return required properties', () => {
  vi.spyOn(storeHooks, 'useAppSelector').mockImplementation((): object => ({
    data: mockedOperation,
  }));

  const { result } = renderHook(() => useWorkCenterMaintainSetup(false, false));
  expect(result.current).toHaveProperty('form');
  expect(result.current).toHaveProperty('workCenterForEdit');
  expect(result.current.isLoaded).toEqual(true);
});
