import { NotificationConfig } from '../../common/models/Notification';
import { NOTIFICATION_CLOSE, UI_NOTIFY } from './ui.types';

export const notifyAction = (notificationConfig: NotificationConfig) => ({
  type: UI_NOTIFY,
  payload: notificationConfig,
});

export const notificationCloseAction = (
  notificationConfig: NotificationConfig
) => ({
  type: NOTIFICATION_CLOSE,
  payload: notificationConfig,
});
