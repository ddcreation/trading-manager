import React from 'react';
import { Card, Table } from 'react-bootstrap';
import { Account } from '../../common/models';
import api from '../../utils/api';

interface DashboardState {
  account: Account;
  exchangeInfos: unknown;
}

class Dashboard extends React.Component<unknown, DashboardState> {
  componentDidMount() {
    Promise.all([
      api.retrieve<Account>(`${api.resources.cryptos}/account`),
      api.retrieve(`${api.resources.cryptos}/exchange-info`),
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
          {this.state.account.balances.map((balance) => {
            return (
              <tr>
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
      this.state &&
      this.state.account && (
        <div>
          {this.state && this.state.account && (
            <Card>
              <Card.Header>
                <Card.Title>My Balances</Card.Title>
              </Card.Header>
              <Card.Body>{this.renderBalance()}</Card.Body>
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
