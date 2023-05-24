import { render, screen } from '@testing-library/react';
import CustomButton from '../button.component';

test('Button is enabled by default and if children are passed they are shown inside', () => {
  render(
    <CustomButton type='button' color='red'>
      <span data-testid='btnIcon'>icon</span>
    </CustomButton>,
  );
  const button = screen.getByTestId('custom-button');
  const icon = screen.getByTestId('btnIcon');
  expect(button).not.toBeDisabled();
  expect(icon).toBeInTheDocument();
});

test('Button is disabled based on prop', () => {
  render(
    <CustomButton isDisabled={true} type='button' color='red'>
      <span data-testid='btnIcon'>icon</span>
    </CustomButton>,
  );
  const button = screen.getByTestId('custom-button');
  expect(button).toBeDisabled();
});

test('Spinner is active based on prop', () => {
  render(
    <CustomButton isLoading={true} type='button' color='red'>
      <>Button</>
    </CustomButton>,
  );
  const spinner = screen.getByTestId('spinner');
  expect(spinner).toBeInTheDocument();
});

test('Button has passed classes', () => {
  render(
    <CustomButton customClass='green' type='button' color='red'>
      <>Button</>
    </CustomButton>,
  );
  const button = screen.getByTestId('custom-button');
  expect(button).toHaveClass('green');
  expect(button).toHaveClass('red');
});
