import React from 'react';
import { Card, Col, Row, Spinner, Table } from 'react-bootstrap';
import { Account, ExchangeInfoResponse } from '../../common/models';
import api from '../../utils/api';

interface DashboardState {
  account: Account;
  exchangeInfos: ExchangeInfoResponse;
}

class Dashboard extends React.Component<unknown, DashboardState> {
  componentDidMount() {
    Promise.all([
      api.retrieve<Account>(`${api.resources.cryptos}/account`),
      api.retrieve<ExchangeInfoResponse>(
        `${api.resources.cryptos}/exchange-info`
      ),
    ]).then(([account, exchangeInfos]) =>
      this.setState({ account, exchangeInfos })
    );
  }

  renderBalance() {
    return this.state.account.balances.length ? (
      <Table striped bordered>
        <thead>
          <tr>
            <th>Asset</th>
            <th>Free</th>
          </tr>
        </thead>
        <tbody>
          {this.state.account.balances.map((balance, idx) => {
            return (
              <tr key={'balance-' + idx}>
                <td>balance asset</td>
                <td>balance free {JSON.stringify(balance)}</td>
              </tr>
            );
          })}
        </tbody>
      </Table>
    ) : (
      <i>You haven't any balance.</i>
    );
  }

  render() {
    return this.state ? (
      <div>
        <Card className='my-5'>
          <Card.Header>
            <Card.Title>
              <h2>My Balances</h2>
            </Card.Title>
          </Card.Header>
          <Card.Body>{this.renderBalance()}</Card.Body>
        </Card>
        {this.state.exchangeInfos && this.state.exchangeInfos.symbols && (
          <Card className='my-5'>
            <Card.Header>
              <Card.Title>Buy crypto</Card.Title>
            </Card.Header>
            <Card.Body>
              <form method='post'>
                <input
                  type='text'
                  id='amount'
                  name='amount'
                  placeholder='eg. 10'
                  min=''
                />

                <select id='symbol' name='symbol'>
                  {this.state.exchangeInfos.symbols.map((symbol) => (
                    <option key={symbol.symbol}>{symbol.symbol}</option>
                  ))}
                </select>

                <input type='submit' name='buy' value='buy' />
              </form>
            </Card.Body>
          </Card>
        )}

        <Card className='my-5'>
          <Card.Header>
            <Card.Title>
              <h2>Account params</h2>
            </Card.Title>
          </Card.Header>
          <Card.Body>
            {Object.keys(this.state.account).map((param) => (
              <Row>
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
      </div>
    ) : (
      <div className='text-center'>
        <Spinner animation='border' role='status'>
          <span className='sr-only'>Loading...</span>
        </Spinner>
      </div>
    );
  }
}

export default Dashboard;
