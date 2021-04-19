import React from 'react';
import { Card, ListGroup } from 'react-bootstrap';
import {
  CryptoCard,
  SimulationPreview,
  TmLoader,
} from '../../common/components';
import MissingConnectorAlert from '../../common/components/missing-connector/MissingConnectorAlert';
import { ConnectorConfig } from '../../common/models/Connector';
import { connectorsService } from '../../services/connectors.service';

interface OpportunitiesConnector {
  config: ConnectorConfig;
  currentSymbol?: string;
  symbols: string[];
}

interface OpportunitiesState {
  connectors: {
    [connectorId: string]: OpportunitiesConnector;
  };
  loading: boolean;
}

class OpportunitiesRoute extends React.Component<null, OpportunitiesState> {
  constructor(props: null) {
    super(props);

    this.state = { connectors: {}, loading: true };
  }

  async componentDidMount() {
    const connectorsWithConfig = await connectorsService.listActiveConnectors$();

    const opportunitiesConnector: {
      [connectorId: string]: OpportunitiesConnector;
    } = {};
    Promise.all(
      connectorsWithConfig.map((connectorWithConfig) =>
        connectorsService.getFavorites$(connectorWithConfig.id).then(
          (symbols) =>
            (opportunitiesConnector[connectorWithConfig.id] = {
              config: connectorWithConfig,
              symbols,
            })
        )
      )
    ).then(() =>
      this.setState({ loading: false, connectors: opportunitiesConnector })
    );
  }

  renderConnector(connector: OpportunitiesConnector) {
    return (
      <Card key={`connector-${connector.config.id}`}>
        <Card.Header>
          <h2>{connector.config.name}</h2>
        </Card.Header>
        <Card.Body>
          <ListGroup
            className='mb-5'
            horizontal
            onSelect={(evtKey) =>
              this.symbolSelection(connector.config.id, evtKey as string)
            }
          >
            {connector.symbols.map((symbol) => (
              <ListGroup.Item
                action
                eventKey={symbol}
                key={`tab-${symbol.toLowerCase()}`}
              >
                {symbol}
              </ListGroup.Item>
            ))}
          </ListGroup>
          {connector.currentSymbol && (
            <div>
              <CryptoCard
                connectorId={connector.config.id}
                symbol={connector.currentSymbol}
              />
              <h2 className='mt-5'>Simulations</h2>
              <hr />
              <SimulationPreview
                connectorId={connector.config.id}
                symbol={connector.currentSymbol}
              ></SimulationPreview>
            </div>
          )}
        </Card.Body>
      </Card>
    );
  }

  render() {
    return !this.state?.loading ? (
      Object.keys(this.state?.connectors).length === 0 ? (
        <MissingConnectorAlert />
      ) : (
        Object.keys(this.state?.connectors).map((connectorId) =>
          this.renderConnector(this.state?.connectors[connectorId])
        )
      )
    ) : (
      <TmLoader />
    );
  }

  symbolSelection(connectorId: string, key: string): void {
    const newState = this.state;
    newState.connectors[connectorId].currentSymbol = key;
    this.setState(newState);
  }
}

export default OpportunitiesRoute;
