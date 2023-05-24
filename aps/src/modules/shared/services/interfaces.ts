/**@module CustomNotificationInterfaces */
import { NotificationPlacement } from 'antd/lib/notification/interface';

export default interface BaseResponse {
  /** Is true when an API request is sent but not completed yet */
  loading?: boolean;
  /** Stores errors returned from an unsuccessful API call */
  error?: string | undefined;
}

export interface NotificationOpen {
  /** Message shown in the notification */
  message: string;
  /** Additional text shown in the notification */
  description: string;
  /** Where is the notification placed. 'Top' is used in most cases */
  placement: NotificationPlacement;
  /** Additional styling given to the notification */
  className: string;
  /** Additional props, used for testing */
  props: { 'data-testid': string };
}
