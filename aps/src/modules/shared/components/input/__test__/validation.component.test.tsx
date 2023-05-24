import { render, screen } from '@testing-library/react';
import Validation from '../validation.component';

test('Shows validation message that is passed as an argument', () => {
  render(<Validation message='This field is required' />);
  const validationMsg = screen.getByTestId('validation-message');
  expect(validationMsg).toBeInTheDocument();
});
