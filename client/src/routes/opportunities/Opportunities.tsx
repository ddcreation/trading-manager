import React from 'react';
import { ListGroup, Spinner } from 'react-bootstrap';
import CryptoSimulation from '../../common/components/crypto-simulation/CryptoSimulation';
import api from '../../utils/api';

interface OpportunitiesState {
  loading: boolean;
  simulation: unknown;
  symbols: string[];
}

class OpportunitiesRoute extends React.Component<null, OpportunitiesState> {
  constructor(props: null) {
    super(props);

    this.setState({
      loading: true,
      simulation: null,
      symbols: [],
    });
  }

  componentDidMount() {
    api
      .retrieve<string[]>(`${api.resources.cryptos}/favorites`)
      .then((symbols) => this.setState({ symbols }));
  }

  render() {
    return (
      this.state && (
        <div>
          <ListGroup
            className='mb-5'
            horizontal
            onSelect={(evtKey) => this.symbolSelection(evtKey)}
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
          {this.state.loading && (
            <div className='text-center mt-5'>
              <Spinner animation='border' role='status'>
                <span className='sr-only'>Loading...</span>
              </Spinner>
            </div>
          )}
          {this.state.simulation && (
            <CryptoSimulation simulation={this.state.simulation} />
          )}
        </div>
      )
    );
  }

  symbolSelection(key: unknown): void {
    this.setState({ loading: true, simulation: null });

    api
      .retrieve<unknown>(`${api.resources.cryptos}/${key}/simulation`)
      .then((response) => {
        response = 'Crypto simulate';
        this.setState({ loading: false, simulation: JSON.stringify(response) });
      });
  }
}

export default OpportunitiesRoute;
