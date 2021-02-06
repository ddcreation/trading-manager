import React from 'react';
import { ListGroup, Row } from 'react-bootstrap';
import { CryptoCard, SimulationsGroup } from '../../common/components';
import api from '../../utils/api';

interface OpportunitiesState {
  currentSymbol: string;
  simulations: unknown[];
  symbols: string[];
}

class OpportunitiesRoute extends React.Component<null, OpportunitiesState> {
  constructor(props: null) {
    super(props);

    this.setState({
      simulations: [],
      symbols: [],
    });
  }

  componentDidMount() {
    api
      .retrieve<string[]>(`${api.resources.cryptos}/favorites`)
      .then((symbols) => this.setState({ symbols }));
  }

  loadSimulations() {}

  render() {
    return (
      this.state && (
        <div>
          <ListGroup
            className='mb-5'
            horizontal
            onSelect={(evtKey) => this.symbolSelection(evtKey as string)}
          >
            {this.state &&
              this.state.symbols &&
              this.state.symbols.map((symbol) => (
                <ListGroup.Item
                  action
                  eventKey={symbol}
                  key={`tab-${symbol.toLowerCase()}`}
                >
                  {symbol}
                </ListGroup.Item>
              ))}
          </ListGroup>
          {this.state.currentSymbol && (
            <div>
              <CryptoCard symbol={this.state.currentSymbol} />
              <Row className='mt-5'>
                <h2>Simulations</h2>
                <hr />
              </Row>
              <Row>
                <SimulationsGroup
                  symbol={this.state.currentSymbol}
                ></SimulationsGroup>
              </Row>
            </div>
          )}
        </div>
      )
    );
  }

  symbolSelection(key: string): void {
    this.setState({ currentSymbol: key, simulations: [] });

    this.loadSimulations();
  }
}

export default OpportunitiesRoute;
