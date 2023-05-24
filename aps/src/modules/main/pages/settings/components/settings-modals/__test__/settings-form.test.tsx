import { useForm, FormProvider } from 'react-hook-form';
import { render, renderHook, screen } from '@testing-library/react';
import SettingsForm from '../settings-form.component';

const mockDispatch = vi.fn();
vi.mock('react-redux', () => ({
  useSelector: vi.fn(),
  useDispatch: () => mockDispatch,
}));

describe('settings form component', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    vi.mock('@/modules/shared/components/input/input.component', () => ({
      default: vi.fn(),
    }));
  });
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('form component renders properly with inputs', () => {
    const { result } = renderHook(() => useForm());

    render(<FormProvider {...result.current}>{<SettingsForm />}</FormProvider>);

    const form = screen.getByTestId('settings-form');

    expect(form).toBeInTheDocument();
  });
});
