import React from 'react';
import { ListGroup } from 'react-bootstrap';
import CryptoCard from '../../common/components/crypto-card/CryptoCard';
import api from '../../utils/api';

interface OpportunitiesState {
  currentSymbol: string;
  symbols: string[];
}

class OpportunitiesRoute extends React.Component<null, OpportunitiesState> {
  constructor(props: null) {
    super(props);

    this.setState({
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
            <CryptoCard symbol={this.state.currentSymbol} />
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
