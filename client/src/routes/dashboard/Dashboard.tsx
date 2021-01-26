import React from 'react';
import { Card, Table } from 'react-bootstrap';
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
    return (
      this.state && (
        <div>
          <Card>
            <Card.Header>
              <Card.Title>My Balances</Card.Title>
            </Card.Header>
            <Card.Body>{this.renderBalance()}</Card.Body>
          </Card>
          {this.state.exchangeInfos && this.state.exchangeInfos.symbols && (
            <Card>
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
          <div>
            <h2>Account</h2>
            <pre>{this.state && JSON.stringify(this.state.account)}</pre>
          </div>
        </div>
      )
    );
  }
}

export default Dashboard;

// <select id='symbol' name='symbol'>
//                   {this.state.symbols.map((symbol) => (
//                     <option>{symbol.name}</option>
//                   ))}
//                 </select>
