import { render, renderHook, screen } from '@testing-library/react';
import { FormProvider, useForm } from 'react-hook-form';
import ParametersForm from '../parameters-form.component';

const mockDispatch = vi.fn();
vi.mock('react-redux', () => ({
  useSelector: vi.fn(),
  useDispatch: () => mockDispatch,
}));

describe('parameters form component', () => {
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

    render(<FormProvider {...result.current}>{<ParametersForm />}</FormProvider>);

    const form = screen.getByTestId('parameters-form');

    expect(form).toBeInTheDocument();
  });
});
