/**
 * @module NotificationService
 */

import { notification } from 'antd';
import { NotificationPlacement } from 'antd/lib/notification/interface';
import { NotificationOpen } from './interfaces';

const notificationOpen = (
  message: string,
  description: string,
  notificationType: NotificationType,
): NotificationOpen => {
  return {
    message,
    description,
    placement: 'top' as NotificationPlacement,
    className: notificationType,
    props: { 'data-testid': 'antd-notification' },
  };
};

const notificationTop = (
  notificationType: NotificationType,
  message: string,
  description: string,
): void => {
  notification.destroy();
  notification.open(notificationOpen(message, description, notificationType));
};

enum NotificationType {
  success = 'notification-success',
  fail = 'notification-failed',
  info = 'notification-info',
}
/**
 *
 * @param message Message shown inside the notification
 * @param description Additional text inside the notification
 * @returns Antd notification component which indicates that the action taken by the user was successfully completed
 */
export const notificationSuccess = (message: string, description = ''): void => {
  notificationTop(NotificationType.success, message, description);
};
/**
 *
 * @param message Message shown inside the notification
 * @param description Additional text inside the notification
 * @returns Antd notification component which indicates that the action taken by the user was not successfully completed
 */
export const notificationFail = (message: string, description = ''): void => {
  notificationTop(NotificationType.fail, message, description);
};
