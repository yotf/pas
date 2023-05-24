import { render, renderHook, screen } from '@testing-library/react';
import * as positionsHooks from '../../hooks/positions';
import * as rolesHooks from '../../hooks/roles';
import { FormProvider, useForm } from 'react-hook-form';
import UserForm from '../user-form.component';
import { mockedData, mockedRoles } from '@/modules/shared/test-config/helpers/consts/sharedMocks';

const mockDispatch = vi.fn();
vi.mock('react-redux', () => ({
  useSelector: vi.fn(),
  useDispatch: () => mockDispatch,
}));

describe('user form component', () => {
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
    vi.spyOn(positionsHooks, 'useUserPositions').mockImplementation(() => ({
      positions: mockedData,
      options: [],
    }));

    vi.spyOn(rolesHooks, 'useRoles').mockImplementation(() => ({
      roles: mockedRoles,
      options: [],
    }));

    const { result } = renderHook(() => useForm());

    render(<FormProvider {...result.current}>{<UserForm />}</FormProvider>);

    const form = screen.getByTestId('user-form');

    expect(form).toBeInTheDocument();
  });
});
