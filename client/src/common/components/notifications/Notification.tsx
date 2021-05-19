import React from 'react';
import { Alert } from 'react-bootstrap';
import { notificationCloseAction, store } from '../../../redux';
import {
  NotificationConfig,
  NotificationType,
} from '../../models/Notification';

interface NotificationProps {
  config: NotificationConfig;
}

class NotificationComponent extends React.Component<
  NotificationProps,
  unknown
> {
  get variant(): string {
    if (this.props.config.type === NotificationType.ERROR) {
      return 'danger';
    } else if (this.props.config.type === NotificationType.SUCCESS) {
      return 'success';
    }

    return 'info';
  }

  onClose() {
    store.dispatch(notificationCloseAction(this.props.config));
  }

  render() {
    if (this.props.config.persistent === false) {
      setTimeout(() => this.onClose(), 5000);
    }

    return (
      <Alert
        variant={this.variant}
        dismissible={this.props.config.dismissable}
        onClose={() => this.onClose()}
      >
        {this.props.config.title ? (
          <Alert.Heading>{this.props.config.title}</Alert.Heading>
        ) : null}
        <p>{this.props.config.body}</p>
      </Alert>
    );
  }
}

export default NotificationComponent;
