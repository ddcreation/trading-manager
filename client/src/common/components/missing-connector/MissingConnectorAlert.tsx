import React from 'react';
import { Alert } from 'react-bootstrap';
import { NavLink } from 'react-router-dom';

class MissingConnectorAlert extends React.Component {
  render() {
    return (
      <Alert variant='danger'>
        <Alert.Heading>Oh snap! Some configuration is missing!</Alert.Heading>
        <p>
          It seems that you doesn't have any activated connector. Please go
          first to the connectors configuration inside the user menu or{' '}
          <Alert.Link as={NavLink} to='/connectors'>
            click here
          </Alert.Link>
        </p>
      </Alert>
    );
  }
}

export default MissingConnectorAlert;
