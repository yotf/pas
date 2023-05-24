/**
 * @module CustomNotificationInterface
 */

import { Dispatch, SetStateAction } from 'react';

export interface Notification {
  /** Controls if notification is visible */
  showNotification: boolean;
  /** Sets showNotification value */
  setShowNotification: Dispatch<SetStateAction<boolean>>;
  /** Message to be shown to the user inside the notification */
  message: string;
}
