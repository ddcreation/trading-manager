import React from 'react';
import { Alert } from 'react-bootstrap';
import { NavLink } from 'react-router-dom';

interface MissingConfigAlertProps {
  config: 'connector' | 'connector-config' | 'favorites';
}

class MissingConfigAlert extends React.Component<
  MissingConfigAlertProps,
  unknown
> {
  render() {
    let message: string;
    let showConnectorsLink = true;
    switch (this.props.config) {
      default:
      case 'connector-config': {
        showConnectorsLink = false;
        message = "You should first set the connector's datas and activate it.";
        break;
      }
      case 'connector': {
        message =
          "It seems that you doesn't have any activated connector. Please go first to the connectors configuration inside the user menu.";
        break;
      }
      case 'favorites': {
        message =
          "It seems that you doesn't add any favorites assets in your connector. Please go first to the connectors favorites assets inside the user menu.";
        break;
      }
    }

    return (
      <Alert variant='danger'>
        <Alert.Heading>Oh snap! Some configuration is missing!</Alert.Heading>
        <p>
          {message}{' '}
          {showConnectorsLink && (
            <Alert.Link as={NavLink} to='/connectors'>
              Go to connectors configuration
            </Alert.Link>
          )}
        </p>
      </Alert>
    );
  }
}

export default MissingConfigAlert;
