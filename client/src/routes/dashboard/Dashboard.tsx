import React from 'react';
import { Button, Card, Col, Form, Row, Spinner, Table } from 'react-bootstrap';
import CryptoCard from '../../common/components/crypto-card/CryptoCard';
import { Account, ExchangeInfoResponse } from '../../common/models';
import api from '../../utils/api';

interface DashboardState {
  account: Account;
  favoritesSymbols: string[];
  exchangeInfos: ExchangeInfoResponse;
}

class DashboardRoute extends React.Component<unknown, DashboardState> {
  componentDidMount() {
    Promise.all([
      api.retrieve<string[]>(`${api.resources.cryptos}/favorites`),
      api.retrieve<Account>(`${api.resources.cryptos}/account`),
      api.retrieve<ExchangeInfoResponse>(
        `${api.resources.cryptos}/exchange-info`
      ),
    ]).then(([favoritesSymbols, account, exchangeInfos]) =>
      this.setState({ account, exchangeInfos, favoritesSymbols })
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
              <Card.Title>Buy crypto (WIP)</Card.Title>
            </Card.Header>
            <Card.Body>
              <Form>
                <Form.Row>
                  <Form.Group as={Col} controlId='amount'>
                    <Form.Control name='amount' placeholder='eg. 10' />
                  </Form.Group>

                  <Form.Group as={Col} controlId='symbol'>
                    <Form.Control as='select' defaultValue='Choose...'>
                      <option disabled>Choose...</option>
                      {this.state.exchangeInfos.symbols.map((symbol) => (
                        <option key={symbol.symbol}>{symbol.symbol}</option>
                      ))}
                    </Form.Control>
                  </Form.Group>
                  <Col>
                    <Button type='submit' disabled>
                      Buy
                    </Button>
                  </Col>
                </Form.Row>
              </Form>
            </Card.Body>
          </Card>
        )}
        {this.state.favoritesSymbols && (
          <div className='my-5'>
            <h2>My favorites</h2>
            <Row>
              {this.state.favoritesSymbols.map((symbol) => (
                <div className='col-12 col-lg-6 mt-3'>
                  <CryptoCard symbol={symbol} />
                </div>
              ))}
            </Row>
          </div>
        )}
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

export default DashboardRoute;
