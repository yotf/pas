import { render, screen } from '@testing-library/react';
import HomePage from '../home.page';

test('Home page rendered', () => {
  render(<HomePage />);
  const pageWrapper = screen.getByTestId('home-page');
  expect(pageWrapper).toBeInTheDocument();
});
