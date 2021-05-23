import {
  NotificationConfig,
  NotificationType,
} from '../../../common/models/Notification';
import { notifyAction, store } from '../../../redux';

export const errorNotificationInterceptor = (error: any): Promise<never> => {
  store.dispatch(
    notifyAction({
      type: NotificationType.ERROR,
      title:
        error?.response?.data.code ||
        `HTTP Error ${error.status || 'server not responding'}`,
      body: error?.response?.data.message || error.statusText,
      persistent: false,
      dismissable: true,
    } as NotificationConfig)
  );

  return Promise.reject(error.response);
};
