import React from 'react';
import { Button, Card, Col, Form, Row, Table } from 'react-bootstrap';
import { CryptoCard, TmLoader } from '../../common/components';
import { Account, ExchangeInfoResponse } from '../../common/models';
import { cryptoService } from '../../services/crypto.service';

interface DashboardState {
  account: Account;
  favoritesSymbols: string[];
  exchangeInfos: ExchangeInfoResponse;
}

class DashboardRoute extends React.Component<unknown, DashboardState> {
  componentDidMount() {
    Promise.all([
      cryptoService.getFavorites$(),
      cryptoService.getAccount$(),
      cryptoService.getExchangeInfos$(),
    ]).then(([favoritesSymbols, account, exchangeInfos]) =>
      this.setState({ account, exchangeInfos, favoritesSymbols })
    );
  }

  renderBalance() {
    return this.state?.account?.balances?.length ? (
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
      <div>
        <h2>My Balances</h2>
        <Card className='my-3'>
          <Card.Body>{this.renderBalance()}</Card.Body>
        </Card>
        <hr className='my-5' />
        <h2>Buy crypto (WIP)</h2>
        {this.state?.exchangeInfos && this.state.exchangeInfos.symbols ? (
          <Row className='my-3'>
            <Form className='col-12'>
              <Form.Row>
                <Form.Group as={Col} controlId='amount' className='col-6'>
                  <Form.Control name='amount' placeholder='eg. 10' />
                </Form.Group>

                <Form.Group as={Col} controlId='symbol' className='col-4'>
                  <Form.Control as='select' defaultValue='Choose...'>
                    <option disabled>Choose...</option>
                    {this.state.exchangeInfos.symbols.map((symbol) => (
                      <option key={symbol.symbol}>{symbol.symbol}</option>
                    ))}
                  </Form.Control>
                </Form.Group>
                <Col className='col-2'>
                  <Button type='submit' disabled>
                    Buy
                  </Button>
                </Col>
              </Form.Row>
            </Form>
          </Row>
        ) : (
          <TmLoader />
        )}
        <hr className='my-5' />
        <h2>My favorites</h2>
        {this.state?.favoritesSymbols ? (
          <Row>
            {this.state.favoritesSymbols.map((symbol) => (
              <div key={symbol} className='col-12 col-lg-6 mt-3'>
                <CryptoCard symbol={symbol} />
              </div>
            ))}
          </Row>
        ) : (
          <TmLoader />
        )}
      </div>
    );
  }
}

export default DashboardRoute;
