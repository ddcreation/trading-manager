import React from 'react';
import { Card, Col, Row } from 'react-bootstrap';
import { TmLoader } from '../../common/components';
import { Account } from '../../common/models';
import { connectorsService } from '../../services/connectors.service';
import { userService } from '../../services/user.service';

interface AccountState {
  account: Account;
  user: { [k: string]: unknown };
}

class AccountRoute extends React.Component<unknown, AccountState> {
  componentDidMount() {
    Promise.all([
      userService.me$(),
      connectorsService.getAccount$(),
    ]).then(([user, account]) => this.setState({ user, account }));
  }

  render() {
    return this.state ? (
      <Card className='my-5'>
        <Card.Header>
          <Card.Title>
            <h2>User datas</h2>
          </Card.Title>
        </Card.Header>
        <Card.Body>
          {Object.keys(this.state.user).map((param) => (
            <Row key={`user-${param}`}>
              <Col>
                <label>{param}</label>
              </Col>
              <Col className='text-aling-right'>
                {JSON.stringify(this.state.user[param as keyof Account])}
              </Col>
            </Row>
          ))}
        </Card.Body>
      </Card>
    ) : (
      <TmLoader />
    );
  }
}

export default AccountRoute;
