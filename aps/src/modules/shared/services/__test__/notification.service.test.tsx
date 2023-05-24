import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { notificationFail, notificationSuccess } from '../notification.service';

const notificationSuccessTest = (message: string, description: string | undefined = undefined) => {
  return (
    <div>
      <button data-testid='btn' onClick={() => notificationSuccess(message, description)}>
        Open notification
      </button>
    </div>
  );
};

const notificationFailTest = (message: string, description: string | undefined = undefined) => {
  return (
    <div>
      <button data-testid='btn' onClick={() => notificationFail(message, description)}>
        Open notification
      </button>
    </div>
  );
};

test('Opens fail notification', async () => {
  render(notificationSuccessTest('Success notification', 'Success description'));
  const button = screen.getByTestId('btn');
  fireEvent.click(button);
  await waitFor(() => {
    const notification = screen.getAllByTestId('antd-notification');
    expect(notification[0]).toBeInTheDocument();
  });
});
test('Opens success notification', async () => {
  render(notificationFailTest('Failed notification', 'Failed description'));
  const button = screen.getAllByTestId('btn');
  fireEvent.click(button[0]);
  await waitFor(() => {
    const notification = screen.getAllByTestId('antd-notification');
    expect(notification[0]).toBeInTheDocument();
  });
});
test('Doesnt show success description if it is not passed in', () => {
  const { container } = render(notificationSuccessTest('Success'));
  const button = screen.getByTestId('btn');
  fireEvent.click(button);
  expect(container.textContent).not.toBe('Success description');
});
test('Doesnt show failed description if it is not passed in', () => {
  const { container } = render(notificationFailTest('Failed'));
  const button = screen.getByTestId('btn');
  fireEvent.click(button);
  expect(container.textContent).not.toBe('Failed description');
});
