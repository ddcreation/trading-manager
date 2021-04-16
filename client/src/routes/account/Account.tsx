import React from 'react';
import { Card, Col, Row } from 'react-bootstrap';
import { TmLoader } from '../../common/components';
import { Account } from '../../common/models';
import { cryptoService } from '../../services/crypto.service';

interface AccountState {
  account: Account;
}

class AccountRoute extends React.Component<unknown, AccountState> {
  componentDidMount() {
    cryptoService.getAccount$().then((account) => this.setState({ account }));
  }

  render() {
    return this.state ? (
      <Card className='my-5'>
        <Card.Header>
          <Card.Title>
            <h2>Parameters</h2>
          </Card.Title>
        </Card.Header>
        <Card.Body>
          {Object.keys(this.state.account).map((param) => (
            <Row key={`account-${param}`}>
              <Col>
                <label>{param}</label>
              </Col>
              <Col className='text-aling-right'>
                {JSON.stringify(this.state.account[param as keyof Account])}
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
