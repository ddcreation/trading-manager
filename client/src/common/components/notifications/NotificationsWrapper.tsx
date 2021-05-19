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
      <Container fluid className='position-fixed fixed-bottom'>
        {this.props.notifications && (
          <Row className='justify-content-end'>
            <Col sm={{ offset: 6 }} md={{ offset: 8 }} lg={{ offset: 10 }}>
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
