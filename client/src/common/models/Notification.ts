export const NotificationType = {
  ERROR: 'ERROR' as const,
  SUCCESS: 'SUCCESS' as const,
};

// eslint-disable-next-line @typescript-eslint/no-redeclare
export type NotificationType = keyof typeof NotificationType;

export interface NotificationConfig {
  body: string;
  dismissable?: boolean;
  persistent?: boolean;
  title?: string;
  type: NotificationType;
}
