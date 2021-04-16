import React from 'react';
import { ListGroup } from 'react-bootstrap';
import { CryptoCard, SimulationPreview } from '../../common/components';
import { cryptoService } from '../../services/crypto.service';

interface OpportunitiesState {
  currentSymbol: string;
  symbols: string[];
}

class OpportunitiesRoute extends React.Component<null, OpportunitiesState> {
  constructor(props: null) {
    super(props);

    this.setState({ symbols: [] });
  }

  componentDidMount() {
    cryptoService.getFavorites$().then((symbols) => this.setState({ symbols }));
  }

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
              <h2 className='mt-5'>Simulations</h2>
              <hr />
              <SimulationPreview
                symbol={this.state.currentSymbol}
              ></SimulationPreview>
            </div>
          )}
        </div>
      )
    );
  }

  symbolSelection(key: string): void {
    this.setState({ currentSymbol: key });
  }
}

export default OpportunitiesRoute;
