import React from 'react';
import { Alert, Card, Col, Container, Row, Table } from 'react-bootstrap';
import TmLoader from '../tm-loader/TmLoader';
import api from '../../../utils/api';
import PercentBadge from '../percent-badge/PercentBadge';
import { Simulation, Tick, TransactionDirection } from '../../models';
import { Line } from 'react-chartjs-2';
import OpportunityButton from '../opportunity-button/OpportunityButton';

interface SimulationPreviewProps {
  symbol: string;
}

interface SimulationPreviewState {
  loading: boolean;
  simulations: Simulation[];
}

const formatDateForGraph = (date: string | number): string =>
  new Date(date).toISOString().substr(0, 10);

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

  graphDatas(simulation: Simulation) {
    const tradesPointsColor = Array(simulation.history.length).fill('black');

    const tradesStyles = {
      pointStyle: Array(simulation.history.length).fill('circle'),
      pointBackgroundColor: tradesPointsColor,
      pointBorderColor: tradesPointsColor,
      pointBorderWidth: '5',
    };

    const tradesDataset: (number | null)[] = simulation.history.map(
      (tick: Tick, idx: number) => {
        const currentDate = formatDateForGraph(tick.closeTime);

        // Entry
        const entryTrade = simulation.trades.find(
          (trade) => formatDateForGraph(trade.entryTime) === currentDate
        );

        if (entryTrade) {
          tradesStyles.pointStyle[idx] = 'triangle';
          return entryTrade.entryPrice;
        }

        // Close
        const closeTrade = simulation.trades.find(
          (trade) => formatDateForGraph(trade.exitTime) === currentDate
        );

        if (closeTrade) {
          tradesStyles.pointStyle[idx] = 'rect';
          tradesPointsColor[idx] =
            closeTrade.exitPrice < closeTrade.entryPrice ? 'red' : 'green';
          return closeTrade.exitPrice;
        }

        return null;
      }
    );

    return {
      labels: simulation.history.map((tick: Tick) =>
        formatDateForGraph(tick.closeTime)
      ),
      datasets: [
        {
          label: 'Crypto close price',
          fill: false,
          data: simulation.history.map((tick: Tick) => tick.close),
          pointRadius: 0,
        },

        {
          label: 'Trades',
          fill: false,
          data: tradesDataset,
          backgroundColor: 'black',
          borderColor: 'black',
          ...tradesStyles,
        },
      ],
    };
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
                (simulation: Simulation, simulIndex: number) => (
                  <Card key={simulIndex}>
                    <Card.Header>
                      <Container className='px-0'>
                        <Row>
                          <Col md='auto'>
                            <Card.Title>
                              <h4>{simulation.name}</h4>
                              {Object.keys(simulation.oportunities).map(
                                (opportunityKey: any) => {
                                  return (
                                    simulation.oportunities[
                                      opportunityKey as TransactionDirection
                                    ] && (
                                      <OpportunityButton
                                        symbol={this.props.symbol}
                                        direction={opportunityKey}
                                      ></OpportunityButton>
                                    )
                                  );
                                }
                              )}
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
                      <Line data={this.graphDatas(simulation)} />
                      <hr />
                      <h4>Trades</h4>
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
                            {simulation.trades.map(
                              (trade: any, idx: number) => {
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
                                  <tr key={'trade-' + idx}>
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
                              }
                            )}
                          </tbody>
                        </Table>
                      )}
                      {simulation.trades.length === 0 && (
                        <i>No trades generated with this strategy...</i>
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
