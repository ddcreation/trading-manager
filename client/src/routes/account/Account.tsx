import React from 'react';
import { Card, Col, Row, Spinner } from 'react-bootstrap';
import { Account } from '../../common/models';
import api from '../../utils/api';

interface AccountState {
  account: Account;
}

class AccountRoute extends React.Component<unknown, AccountState> {
  componentDidMount() {
    api
      .retrieve<Account>(`${api.resources.cryptos}/account`)
      .then((account) => this.setState({ account }));
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
      <div className='text-center'>
        <Spinner animation='border' role='status'>
          <span className='sr-only'>Loading...</span>
        </Spinner>
      </div>
    );
  }
}

export default AccountRoute;
