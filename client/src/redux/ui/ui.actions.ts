import { NotificationConfig } from '../../common/models/Notification';
import { UI_NOTIFY } from './ui.types';

export const notifyAction = (notificationParams: NotificationConfig) => ({
  type: UI_NOTIFY,
  payload: notificationParams,
});
