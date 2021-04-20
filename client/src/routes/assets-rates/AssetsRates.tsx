import React from 'react';
import { Card } from 'react-bootstrap';
import { TmLoader, TradingCard } from '../../common/components';
import MissingConnectorAlert from '../../common/components/missing-connector/MissingConnectorAlert';
import { ConnectorConfig } from '../../common/models/Connector';
import { connectorsService } from '../../services/connectors.service';

interface AssetsRatesConnector {
  config: ConnectorConfig;
  assets: { [key: string]: string };
}

interface AssetsRatesState {
  connectors: {
    [connectorId: string]: AssetsRatesConnector;
  };
  loading: boolean;
}

class AssetsRatesRoute extends React.Component<unknown, AssetsRatesState> {
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
      [connectorId: string]: AssetsRatesConnector;
    } = {};
    Promise.all(
      connectorsWithConfig.map((connectorWithConfig) =>
        connectorsService.getPrices$(connectorWithConfig.id).then(
          (assets) =>
            (ratesConnectors[connectorWithConfig.id] = {
              config: connectorWithConfig,
              assets,
            })
        )
      )
    ).then(() =>
      this.setState({ loading: false, connectors: ratesConnectors })
    );
  }

  renderConnector(connector: AssetsRatesConnector) {
    const assets = Object.keys(connector.assets || []).map((asset) => ({
      name: asset,
      price: Number(connector.assets[asset]),
    }));

    return (
      <Card key={`connector-${connector.config.id}`}>
        <Card.Header>
          <h2>{connector.config.name}</h2>
        </Card.Header>
        <Card.Body>
          {assets.map((assetPrice, idx) => (
            <TradingCard assetPrice={assetPrice} key={assetPrice.name + idx} />
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

export default AssetsRatesRoute;
