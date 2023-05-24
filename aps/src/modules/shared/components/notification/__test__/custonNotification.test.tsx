import { render, screen } from '@testing-library/react';
import CustomNotification from '../customNotification.component';

test('Notification test is shown', () => {
  render(
    <CustomNotification
      message='Notification failed'
      showNotification={true}
      setShowNotification={vi.fn()}
    />,
  );
  const notification = screen.getByTestId('notification');
  expect(notification).toBeInTheDocument();
});

test('Notification test is not shown', () => {
  render(
    <CustomNotification
      message='Notification failed'
      showNotification={false}
      setShowNotification={vi.fn()}
    />,
  );
  const notification = screen.queryByTestId('notification');
  expect(notification).not.toBeInTheDocument();
});
