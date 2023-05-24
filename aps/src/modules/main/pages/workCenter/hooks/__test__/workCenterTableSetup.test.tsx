import { renderHook } from '@testing-library/react';
import { test } from 'vitest';
import * as storeHooks from '../../../../../../store/hooks';
import { useWorkCenterTableSetup } from '../useWorkCenterTableSetup';
import {
  mockedWorkCapacities,
  mockedAllowedOperations,
} from '@/modules/main/pages/workCenter/__test__/consts';

const mockDispatch = vi.fn();
vi.mock('react-redux', () => ({
  useSelector: vi.fn(),
  useDispatch: () => mockDispatch,
}));

const mockedTranslate = vi.fn().mockResolvedValue('test');

beforeEach(() => {
  vi.restoreAllMocks();
  vi.mock('react-hook-form', () => ({
    useFormContext: () => ({
      watch: vi.fn().mockImplementation(() => {
        return { allowedOperations: [{ id: 1, operationId: 123, operation: { name: 'test' } }] };
      }),
    }),
    Controller: vi.fn(),
  }));
});
test('should return a table based on recieved parameters', () => {
  vi.spyOn(storeHooks, 'useAppSelector').mockImplementation((): object => ({
    data1: mockedWorkCapacities,
    data: mockedAllowedOperations,
  }));
  const { result } = renderHook(() =>
    useWorkCenterTableSetup({ activeGroup: false, translate: mockedTranslate }),
  );
  expect(result.current.props.className).toEqual('table-wrapper');
});
