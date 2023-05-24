/**
 * @module CustomNotification
 */

import { FC, useEffect } from 'react';
import { Notification } from './interfaces';
import './customNotification.component.scss';
import close from '@/assets/close.png';

const mountedStyle = {
  animation: 'inAnimation 250ms ease-in',
};
const unmountedStyle = {
  animation: 'outAnimation 270ms ease-out',
  animationFillMode: 'forwards',
};
/**
 * @param showNotification Controls if notification is visible
 * @param setShowNotification Sets showNotification value
 * @param message Message to be shown to the user inside the notification
 * @returns Custom Notification component. See also {@link NotificationService}
 */
const CustomNotification: FC<Notification> = ({
  showNotification,
  message,
  setShowNotification,
}) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowNotification(false);
    }, 5000);

    return () => {
      clearTimeout(timer);
    };
  }, [showNotification, setShowNotification]);

  return (
    <>
      {showNotification && (
        <div
          className='notification'
          style={showNotification ? mountedStyle : unmountedStyle}
          data-testid='notification'
        >
          <div className='notification-content'>
            <p>{message}</p>
            <img
              role='presentation'
              src={close}
              alt='close'
              onClick={(): void => setShowNotification(false)}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default CustomNotification;
