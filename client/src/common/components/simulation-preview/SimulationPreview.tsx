import React from 'react';
import { Alert, Card, Col, Container, Row, Table } from 'react-bootstrap';
import TmLoader from '../tm-loader/TmLoader';
import api from '../../../utils/api';
import PercentBadge from '../percent-badge/PercentBadge';

interface SimulationTrade {
  entryPrice: number;
  entryTime: string;
  exitPrice: number;
  exitTime: string;
  holdingPeriod: number;
  profit: number;
}

interface Simulation {
  history: any[];
  id: string;
  name: string;
  trades: SimulationTrade[];
}

interface SimulationPreviewProps {
  symbol: string;
}

interface SimulationPreviewState {
  loading: boolean;
  simulations: Simulation[];
}

class SimulationPreview extends React.Component<
  SimulationPreviewProps,
  SimulationPreviewState
> {
  state = { loading: true, simulations: [] };

  componentDidMount() {
    this.loadSimulations();
  }

  componentDidUpdate(prevProps: SimulationPreviewProps) {
    if (prevProps.symbol !== this.props.symbol) {
      this.loadSimulations();
    }
  }

  loadSimulations() {
    this.setState({ loading: true, simulations: [] });
    api
      .retrieve<{ simulations: any[] }>(
        `${api.resources.cryptos}/${this.props.symbol}/simulations`
      )
      .then(
        (response) => {
          this.setState({ loading: false, simulations: response.simulations });
        },
        (error) => {
          this.setState({ loading: false, simulations: [] });
        }
      );
  }

  render() {
    return (
      <div>
        {!this.state.loading && (
          <div>
            {this.state.simulations.length > 0 &&
              this.state.simulations.map(
                (simulation: any, simulIndex: number) => (
                  <Card key={simulIndex}>
                    <Card.Header>
                      <Container className='px-0'>
                        <Row>
                          <Col md='auto'>
                            <Card.Title>
                              <h4>{simulation.name}</h4>
                            </Card.Title>
                          </Col>
                          <Col>
                            <div className='float-right'>
                              <PercentBadge
                                percent={simulation.analysis.profitPct}
                                totalTrades={simulation.analysis.totalTrades}
                              />
                            </div>
                          </Col>
                        </Row>
                      </Container>
                    </Card.Header>
                    <Card.Body>
                      {simulation.trades.length && (
                        <Table striped bordered size='sm'>
                          <thead>
                            <tr>
                              <th>Entry time</th>
                              <th>Entry price</th>
                              <th>Exit time</th>
                              <th>Exit price</th>
                              <th>Duration</th>
                              <th>Difference</th>
                            </tr>
                          </thead>
                          <tbody>
                            {simulation.trades.map((trade: any) => {
                              let diffDaysVariant = 'success';
                              if (
                                10 < trade.holdingPeriod &&
                                trade.holdingPeriod < 30
                              ) {
                                diffDaysVariant = 'warning';
                              } else if (trade.holdingPeriod >= 30) {
                                diffDaysVariant = 'danger';
                              }

                              return (
                                <tr>
                                  <td>{trade.entryTime.substr(0, 10)}</td>
                                  <td>{trade.entryPrice}</td>
                                  <td>{trade.exitTime.substr(0, 10)}</td>
                                  <td>{trade.exitPrice}</td>
                                  <td className={'table-' + diffDaysVariant}>
                                    {trade.holdingPeriod}
                                  </td>
                                  <td
                                    className={
                                      trade.profit > 0
                                        ? 'table-success'
                                        : 'table-danger'
                                    }
                                  >
                                    {(trade.profit > 0 ? '+' : '') +
                                      trade.profit.toFixed(2)}
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </Table>
                      )}
                    </Card.Body>
                  </Card>
                )
              )}
            {this.state.simulations.length === 0 && (
              <Alert variant='danger'>
                ERROR: Unable to retrieve simulations.
              </Alert>
            )}
          </div>
        )}
        {this.state.loading && <TmLoader />}
      </div>
    );
  }
}

export default SimulationPreview;
