import { render, renderHook, screen } from '@testing-library/react';
import { useForm, FormProvider } from 'react-hook-form';
import { FieldError } from 'react-hook-form/dist/types/errors';
import CustomInput from '../input.component';
import { InputType } from '../interfaces';

const customInput = (props?: { error?: FieldError | undefined; type?: InputType }) => {
  const { result } = renderHook(() => useForm());
  return (
    <FormProvider {...result.current}>
      <CustomInput
        label='Name'
        type={props?.type || 'text'}
        register={{ name: 'name', onBlur: async () => {}, onChange: async () => {}, ref: () => {} }}
        placeholder='First name'
        error={props?.error}
      />
    </FormProvider>
  );
};
describe('input component', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    vi.mock('../select.component', () => ({
      default: () => <select data-testid='select-input'></select>,
    }));
  });

  it('Shows all properties that are passed in as props', () => {
    const error: FieldError = {
      type: 'error',
      message: 'message',
    };
    render(customInput({ error }));
    const label = screen.getByTestId('input-label');
    const input = screen.getByTestId('input');
    expect(label).toBeInTheDocument();
    expect(label).toHaveClass('font-validation-error');
    expect(input).toBeInTheDocument();
    // expect(input).toHaveClass('input-validation-error');
  });
  it('Doesnt show data that are conditionally rendered if validation is undefined', () => {
    render(customInput());
    const label = screen.getAllByTestId('input-label');
    const input = screen.getByTestId('input');
    expect(label[0]).not.toHaveClass('font-validation-error');
    expect(input).not.toHaveClass('input-validation-error');
  });
  // it('Should show custom select', () => {
  //   const test = render(customInput({ type: 'select' }));
  //   screen.getByTestId('select-input');
  // });
});
