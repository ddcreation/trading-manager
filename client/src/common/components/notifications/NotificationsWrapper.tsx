import React from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import { connect } from 'react-redux';
import { NotificationConfig } from '../../models/Notification';
import NotificationComponent from './Notification';

interface NotificationsProps {
  notifications: NotificationConfig[];
}

class NotificationsWrapper extends React.Component<
  NotificationsProps,
  unknown
> {
  render() {
    return (
      <Container
        fluid
        className='position-fixed fixed-bottom'
        style={{ zIndex: 11000 }}
      >
        {this.props.notifications && (
          <Row className='justify-content-end'>
            <Col sm={{ offset: 4 }} md={{ offset: 6 }} lg={{ offset: 8 }}>
              {this.props.notifications.map((notification, index) => (
                <NotificationComponent
                  key={'notification-' + index}
                  config={notification}
                ></NotificationComponent>
              ))}
            </Col>
          </Row>
        )}
      </Container>
    );
  }
}

const mapStateToProps = (state: any) => {
  return {
    notifications: state.ui.notifications,
  };
};

export default connect(mapStateToProps)(NotificationsWrapper);
