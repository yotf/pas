import { renderHook } from '@testing-library/react';
import { useSettingsCustomColumns } from '../useSettingsCustomColumns.hook';

describe('useSettingsCustomColumns', () => {
  test('should return active', () => {
    const { result } = renderHook(() => useSettingsCustomColumns(vi.fn()));
    const setIsActive = (result.current as any).isActive(true);
    const getClassName = setIsActive.props.className;
    expect(getClassName).toBe('green-color');
  });
  test('should return inactive', () => {
    const { result } = renderHook(() => useSettingsCustomColumns(vi.fn()));
    const setIsActive = (result.current as any).isActive(false);
    const getClassName = setIsActive.props.className;
    expect(getClassName).toBe('gray-light');
  });
});
