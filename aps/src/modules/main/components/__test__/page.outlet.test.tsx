import { render, screen } from '@testing-library/react';
import { test } from 'vitest';
import PageOutlet from '../page.outlet';

test('outlet should be rendered', () => {
  render(<PageOutlet />);
  const outlet = screen.getByTestId('page-outlet');
  expect(outlet).toBeInTheDocument();
});
