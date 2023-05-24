import { render } from '@testing-library/react';
import {
  useController,
  ControllerFieldState,
  ControllerRenderProps,
  FieldValues,
  UseFormStateReturn,
} from 'react-hook-form';
import { describe } from 'vitest';
import CustomSwitch from '../switch/switch.component';

const testSwitch = (value: boolean) => {
  const field = { value } as ControllerRenderProps<FieldValues, string>;
  const config = { field } as {
    field: ControllerRenderProps<FieldValues, string>;
    fieldState: ControllerFieldState;
    formState: UseFormStateReturn<FieldValues>;
  };
  vi.mocked(useController).mockImplementationOnce(() => config);
  const { getByTestId } = render(<CustomSwitch label={'Switch Label'} name={'switch'} />);
  const elem = getByTestId('switch-input') as HTMLInputElement;
  expect(elem.checked).toEqual(value);
};

describe('switch component', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    vi.mock('antd', () => ({
      Switch: ({ checked }: { checked: boolean }) => (
        <input data-testid='switch-input' type='checkbox' onChange={() => {}} checked={checked} />
      ),
    }));
    vi.mock('react-hook-form', () => ({
      useFormContext: () => ({
        control: null,
      }),
      useController: vi.fn(),
    }));
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should have true value', () => {
    testSwitch(true);
  });

  it('should have false value', () => {
    testSwitch(false);
  });
});
