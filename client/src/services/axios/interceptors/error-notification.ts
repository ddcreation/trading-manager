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
        error?.data.code ||
        `HTTP Error ${error.status || 'server not responding'}`,
      body: error?.data.errorMessage || error.statusText,
      persistent: false,
      dismissable: true,
    } as NotificationConfig)
  );

  return Promise.reject(error);
};
