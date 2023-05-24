import { render, screen, within } from '@testing-library/react';
import DropDown from '../dropDown';

const items = [{ label: 'test 1', key: 'test 1' }];

test('dropdown menu', () => {
  render(<DropDown text='Sort by' items={items} />);
  const { getByText } = within(screen.getByTestId('dropdown-menu'));
  expect(getByText('Sort by')).toBeInTheDocument();
});

test('dropdown menu icon', () => {
  render(<DropDown text='Sort by' items={items} />);
  const icon = screen.getByTestId('dropdown-image');
  expect(icon).toBeInTheDocument();
});
