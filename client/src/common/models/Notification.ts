export const NotificationConfigType = {
  ERROR: 'ERROR' as const,
  SUCCESS: 'SUCCESS' as const,
};

// eslint-disable-next-line @typescript-eslint/no-redeclare
export type NotificationConfigType = keyof typeof NotificationConfigType;

export interface NotificationConfig {
  body: string;
  dismissable?: boolean;
  persistent?: boolean;
  title?: string;
  type: NotificationConfigType;
}
