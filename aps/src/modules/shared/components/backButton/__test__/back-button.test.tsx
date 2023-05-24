import { render, screen } from '@testing-library/react';
import { test } from 'vitest';
import BackButton from '../back-button.component';

test('should render back button', () => {
  render(<BackButton />);
  const button = screen.getByTestId('back-button');
  expect(button).toBeInTheDocument();
});
