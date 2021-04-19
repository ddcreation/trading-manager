import React from 'react';
import { Card } from 'react-bootstrap';
import { TmLoader, TradingCard } from '../../common/components';
import MissingConnectorAlert from '../../common/components/missing-connector/MissingConnectorAlert';
import { ConnectorConfig } from '../../common/models/Connector';
import { connectorsService } from '../../services/connectors.service';

interface SymbolsRatesConnector {
  config: ConnectorConfig;
  symbols: { [key: string]: string };
}

interface SymbolsRatesState {
  connectors: {
    [connectorId: string]: SymbolsRatesConnector;
  };
  loading: boolean;
}

class SymbolsRatesRoute extends React.Component<unknown, SymbolsRatesState> {
  constructor(props: unknown) {
    super(props);

    this.state = { connectors: {}, loading: true };
  }

  componentDidMount() {
    this.loadCryptos();
  }

  async loadCryptos() {
    const connectorsWithConfig = await connectorsService.listActiveConnectors$();

    const ratesConnectors: {
      [connectorId: string]: SymbolsRatesConnector;
    } = {};
    Promise.all(
      connectorsWithConfig.map((connectorWithConfig) =>
        connectorsService.getPrices$(connectorWithConfig.id).then(
          (symbols) =>
            (ratesConnectors[connectorWithConfig.id] = {
              config: connectorWithConfig,
              symbols,
            })
        )
      )
    ).then(() =>
      this.setState({ loading: false, connectors: ratesConnectors })
    );
  }

  renderConnector(connector: SymbolsRatesConnector) {
    const assets = Object.keys(connector.symbols || []).map((symbol) => ({
      name: symbol,
      price: Number(connector.symbols[symbol]),
    }));

    return (
      <Card key={`connector-${connector.config.id}`}>
        <Card.Header>
          <h2>{connector.config.name}</h2>
        </Card.Header>
        <Card.Body>
          {assets.map((asset, idx) => (
            <TradingCard asset={asset} key={asset.name + idx} />
          ))}
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
}

export default SymbolsRatesRoute;
