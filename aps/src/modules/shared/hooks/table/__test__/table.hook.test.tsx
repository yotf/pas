import { mockedSettingsData } from '@/modules/shared/test-config/helpers/consts/settings-page-mock';
import { renderHook } from '@testing-library/react';
import { useTable } from '../table.hook';

vi.mock('react-redux', () => ({
  useSelector: () => vi.fn(),
  useDispatch: () => vi.fn(),
}));

describe('useTable', () => {
  test('table hook - should return a table if given data', () => {
    const { result } = renderHook(() =>
      useTable({ dataSource: mockedSettingsData, translateHeader: vi.fn() }),
    );
    expect(result.current.props.children.props.columns).toHaveLength(3);
  });

  test('table hook - should return a empty element if given no data', () => {
    const { result } = renderHook(() => useTable({ dataSource: [], translateHeader: vi.fn() }));
    expect(result.current.props).toHaveProperty('data-testid');
    expect(result.current.props['data-testid']).toBe('empty');
  });
});
