import { render } from '@testing-library/react';
import { DefaultOptionType } from 'antd/lib/select';
import { describe, it } from 'vitest';
import CustomSelect from '../select/select.component';

describe('select component', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    vi.mock('antd', () => {
      return {
        Select: (props: { options: DefaultOptionType[] }) => (
          <select data-testid='select-input'>
            {props.options?.map((o) => (
              <option key={o.value} value={o.value!}>
                {o.label}
              </option>
            ))}
          </select>
        ),
      };
    });
    vi.mock('react-hook-form', () => ({
      useFormContext: () => ({
        control: null,
        getValues: vi.fn(),
      }),
      useController: () => ({ field: {} }),
    }));
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should render', () => {
    const { getByTestId } = render(
      <CustomSelect
        name={'select'}
        options={[
          { value: 1, label: '1' },
          { value: 2, label: '2' },
        ]}
      />,
    );
    const elem = getByTestId('select-input') as HTMLSelectElement;
    console.log(elem.options);
  });
});
