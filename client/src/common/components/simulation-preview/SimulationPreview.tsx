import React from 'react';
import { Alert, Card, Col, Container, Row } from 'react-bootstrap';
import TmLoader from '../tm-loader/TmLoader';
import api from '../../../utils/api';
import PercentBadge from '../percent-badge/PercentBadge';

interface SimulationPreviewProps {
  symbol: string;
}

interface SimulationPreviewState {
  loading: boolean;
  simulations: any[];
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
                            <Card.Title>{simulation.name}</Card.Title>
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
                      {JSON.stringify(this.state.simulations)}
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
